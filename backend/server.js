require('dotenv').config();

const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const router = express.Router(); // Soporte para el prefijo de cPanel

const projectRoot = path.resolve(__dirname, '../..');
const port = Number(process.env.PORT) || 3000;

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (request, file, callback) => {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        const allowedExtensions = /\.(pdf|doc|docx)$/i;
        if (allowedTypes.includes(file.mimetype) && allowedExtensions.test(file.originalname)) {
            callback(null, true);
            return;
        }
        callback(new Error('El currículum debe estar en formato PDF, DOC o DOCX.'));
    }
});

app.use(express.static(projectRoot));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const createTransporter = () => nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const requiredFields = (body) => {
    const fields = ['nombre', 'email', 'mensaje'];
    return fields.filter((field) => !String(body[field] || '').trim());
};

// Definición de la ruta de contacto
const handleContact = async (request, response) => {
    const { body, file } = request;
    const missingFields = requiredFields(body);
    const isApplication = body.tipo === 'postulacion';

    if (isApplication && !file) missingFields.push('curriculum');

    if (missingFields.length) {
        response.status(400).json({ message: 'Completa todos los campos obligatorios.' });
        return;
    }

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        response.status(503).json({ message: 'El servicio de correo no está configurado todavía.' });
        return;
    }

    const subject = isApplication
        ? `Nueva postulación: ${body.nombre}`
        : `Nueva solicitud de servicio: ${body.nombre}`;
    const details = [
        `Nombre / Empresa: ${body.nombre}`,
        `Correo: ${body.email}`,
        body.servicio ? `Servicio: ${body.servicio}` : null,
        '',
        'Mensaje:',
        body.mensaje
    ].filter(Boolean).join('\n');

    try {
        await createTransporter().sendMail({
            from: process.env.MAIL_FROM || process.env.SMTP_USER,
            to: process.env.MAIL_TO || 'contacto@acaraseo.cl',
            cc: process.env.MAIL_CC || 'rahumada@acaraseo.cl',
            replyTo: body.email,
            subject,
            text: details,
            attachments: file ? [{ filename: file.originalname, content: file.buffer, contentType: file.mimetype }] : []
        });
        response.json({ message: isApplication ? 'Tu postulación fue enviada correctamente.' : 'Tu solicitud fue enviada correctamente.' });
    } catch (error) {
        console.error('Error al enviar correo:', error.message);
        response.status(502).json({ message: 'No se pudo enviar el formulario. Inténtalo nuevamente.' });
    }
};

// Registrar la ruta en /api/contact y en /backend/api/contact
router.post('/api/contact', upload.single('curriculum'), handleContact);
router.post('/contact', upload.single('curriculum'), handleContact);
app.use('/backend', router);
app.use('/api', router);
app.post('/api/contact', upload.single('curriculum'), handleContact);

app.use((error, request, response, next) => {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
        response.status(400).json({ message: 'El currículum no puede superar los 5 MB.' });
        return;
    }
    if (error) {
        response.status(400).json({ message: error.message || 'Archivo no válido.' });
        return;
    }
    next();
});

// Inicio compatible con cPanel / Passenger y entorno local
if (typeof(PhusionPassenger) !== 'undefined') {
    app.listen('passenger');
} else {
    app.listen(port, () => {
        console.log(`Acar Web disponible en http://localhost:${port}`);
    });
}