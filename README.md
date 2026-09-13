# Acar Servicios de Aseo

Sitio web institucional de **Acar Servicios de Aseo**, empresa especializada en limpieza, mantención, jardinería y servicios especiales para empresas y hogares.
> **Estado del proyecto:** activo y rediseñado.

La página fue rediseñada para presentar los servicios de Acar de manera clara, profesional y adaptable a dispositivos móviles. Actualmente se encuentra activa y cuenta con formularios funcionales para solicitudes comerciales y postulaciones laborales.
## Rediseño y mejoras realizadas

- Nueva estructura visual para las secciones de inicio, cobertura, servicios, nosotros, contacto y footer.
- Diseño responsive para escritorio, tablets y dispositivos móviles.
- Navegación principal con desplazamiento entre secciones.
- Menú móvil adaptable con control accesible.
- Ventana lateral de contacto para una comunicación rápida.
- Modo especial de **Trabaja con nosotros** dentro de la ventana lateral.
- Formulario de postulaciones con carga de currículum.
- Footer reorganizado con enlaces principales, servicios, redes sociales e Intranet.
- Enlace de Intranet conectado a [PeopleWork](https://app.peoplework.cl/login).
- Eliminación de tarjetas de contacto duplicadas y código CSS obsoleto.
- Eliminación de imágenes sin uso y archivos residuales del sistema.
- Uso de estructura HTML5 semántica con `main`, `section`, `nav`, `address`, `form` y listas de navegación.
## Funcionalidades

### Solicitud de servicios

El formulario principal permite ingresar:

- Nombre o empresa.
- Correo electrónico.
- Servicio de interés.
- Mensaje.

### Contacto rápido

La ventana lateral **Escríbenos** permite enviar una consulta desde cualquier parte del sitio sin abandonar la página.

### Trabaja con nosotros

El enlace del footer abre la misma ventana lateral en modo postulación. Este formulario permite enviar:

- Nombre.
- Correo electrónico.
- Mensaje.
- Currículum en formato PDF, DOC o DOCX.

El archivo adjunto tiene un límite máximo de 5 MB.

### Envío de correos

Los formularios se procesan mediante el endpoint `POST /api/contact` y envían los mensajes a:

- `contacto@acaraseo.cl`
- Copia a `rahumada@acaraseo.cl`

El correo del usuario se utiliza como dirección de respuesta para facilitar la comunicación.
## Tecnologías

### Frontend

- HTML5 semántico.
- CSS3 con variables, Grid, Flexbox y media queries.
- JavaScript vanilla sin frameworks.
- Font Awesome para iconos sociales.

### Backend

- Node.js 18 o superior.
- Express 5.
- Multer 2 para recepción segura de archivos.
- Nodemailer 10 para envío de correos.
- dotenv para configuración mediante variables de entorno.
## Estructura del proyecto

```text
.
├── assets/
│   ├── css/
│   │   ├── responsive.css
│   │   └── styles.css
│   ├── img/
│   │   ├── abrillantado.jpeg
│   │   ├── alfombra.jpg
│   │   ├── favicon.png
│   │   ├── hero.jpg
│   │   ├── icono-especial.png
│   │   ├── icono-inmobiliario.png
│   │   ├── icono-oficina.png
│   │   ├── Jardinería.jpg
│   │   ├── Logo.png
│   │   ├── Oficinas.jpg
│   │   ├── principal.jpeg
│   │   └── vidrios.jpg
│   └── js/
│       └── script.js
├── .env.example
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── assets/js/server.js
```

## Instalación local

Requisitos:

- Node.js 18 o superior.
- Una cuenta SMTP válida para enviar correos.

Instala las dependencias:

```bash
npm install
```

Crea el archivo `.env` a partir de `.env.example`:

```bash
cp .env.example .env
```

Completa las variables SMTP con los datos del proveedor de correo. El archivo `.env` está excluido de Git y no debe publicarse.

Inicia el servidor:

```bash
npm start
```

Luego abre:

```text
http://localhost:3000
```

No abras `index.html` directamente ni uses un servidor estático como Live Server para probar los formularios: el endpoint `/api/contact` pertenece al servidor Node y requiere ejecutar `npm start`.

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto local del servidor. Por defecto: `3000`. |
| `SMTP_HOST` | Servidor SMTP del proveedor de correo. |
| `SMTP_PORT` | Puerto SMTP, normalmente `587` o `465`. |
| `SMTP_SECURE` | `true` para conexión segura directa; `false` para SMTP con STARTTLS. |
| `SMTP_USER` | Usuario de la cuenta SMTP. |
| `SMTP_PASS` | Contraseña o clave de aplicación SMTP. |
| `MAIL_FROM` | Dirección utilizada como remitente. |
| `MAIL_TO` | Destinatario principal. Por defecto: `contacto@acaraseo.cl`. |
| `MAIL_CC` | Destinatario en copia. Por defecto: `rahumada@acaraseo.cl`. |

## Endpoint del backend

### `POST /api/contact`

Acepta formularios `multipart/form-data` para soportar archivos adjuntos.

Campos comunes:

- `nombre`
- `email`
- `mensaje`
- `servicio` opcional
- `tipo` opcional: `contacto` o `postulacion`

Para postulaciones también se requiere el campo `curriculum`.

Responde en formato JSON con un mensaje para mostrar al usuario. El backend valida campos obligatorios, tipo de archivo y límite de tamaño antes de intentar enviar el correo.

## Publicación

1. Instala Node.js en el servidor.
2. Publica el proyecto sin incluir `.env` ni `node_modules`.
3. Ejecuta `npm install` en el servidor.
4. Configura las variables SMTP en `.env`.
5. Ejecuta `npm start` o utiliza un administrador de procesos como PM2. El punto de entrada es `assets/js/server.js`.
6. Configura el dominio o proxy inverso para dirigir el tráfico al puerto de la aplicación.

Antes de publicar, verifica que el remitente SMTP pertenezca al dominio autorizado por el proveedor. Esto mejora la entregabilidad y reduce el riesgo de que los mensajes lleguen a spam.

## Mantenimiento

- Mantener las credenciales únicamente en `.env`.
- Ejecutar `npm audit` después de actualizar dependencias.
- Revisar periódicamente la configuración SPF, DKIM y DMARC del dominio.
- Mantener las imágenes dentro de `assets/img` y referenciarlas desde HTML o CSS.
- Mantener la lógica de interacción en `assets/js/script.js` y la presentación en `assets/css`.
