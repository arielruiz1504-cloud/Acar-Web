const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('#main-menu');
const chatToggle = document.querySelector('.header-cta');
const chatPanel = document.querySelector('#chat-panel');
const chatCloseButtons = document.querySelectorAll('[data-chat-close]');
const chatForm = document.querySelector('.chat-form');
const chatTitle = document.querySelector('#chat-title');
const chatIntro = document.querySelector('#chat-intro');
const careerFields = document.querySelectorAll('.chat-career-field');
const careerFile = document.querySelector('#chat-curriculum');
const contactForm = document.querySelector('.contact-form');

const setFormStatus = (form, message, isError = false) => {
    const status = form?.querySelector('.form-status');
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('is-error', isError);
};

const submitForm = async (form) => {
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    setFormStatus(form, 'Enviando...');

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form)
        });
        const responseText = await response.text();
        let result;

        try {
            result = JSON.parse(responseText);
        } catch {
            throw new Error('El servidor no devolvió una respuesta válida. Ejecuta la aplicación con npm start.');
        }

        if (!response.ok) throw new Error(result.message || 'No fue posible enviar el formulario.');
        setFormStatus(form, result.message);
        form.reset();
    } catch (error) {
        const message = error instanceof TypeError
            ? 'No fue posible conectar con el servidor. Ejecuta la aplicación con npm start.'
            : error.message;
        setFormStatus(form, message, true);
    } finally {
        submitButton.disabled = false;
    }
};

const setChatState = (isOpen) => {
    if (!chatPanel || !chatToggle) return;
    chatPanel.classList.toggle('is-open', isOpen);
    document.querySelector('.chat-backdrop')?.classList.toggle('is-open', isOpen);
    chatPanel.setAttribute('aria-hidden', String(!isOpen));
    chatToggle.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) chatPanel.querySelector('input')?.focus();
};

const setChatMode = (mode) => {
    const isCareer = mode === 'career';
    if (!chatForm || !chatTitle || !chatIntro) return;
    chatTitle.textContent = isCareer ? 'Trabaja con nosotros' : 'Escríbenos!';
    chatIntro.textContent = isCareer
        ? 'Déjanos tus datos y adjunta tu currículum.'
        : 'Cuéntanos qué necesitas y te contactaremos.';
    chatForm.querySelector('[name="tipo"]').value = isCareer ? 'postulacion' : 'contacto';
    careerFields.forEach((field) => {
        field.hidden = !isCareer;
        field.querySelectorAll('input').forEach((input) => { input.required = isCareer; });
    });
    careerFile.required = isCareer;
    setFormStatus(chatForm, '');
};

if (chatToggle && chatPanel) {
    chatToggle.addEventListener('click', () => {
        setChatMode('contact');
        setChatState(true);
    });
    chatCloseButtons.forEach((button) => button.addEventListener('click', () => setChatState(false)));
    document.querySelectorAll('[data-chat-mode="career"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            setChatMode('career');
            setChatState(true);
        });
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') setChatState(false);
    });
}

[contactForm, chatForm].forEach((form) => {
    form?.addEventListener('submit', (event) => {
        event.preventDefault();
        submitForm(form);
    });
});

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

document.querySelector('a[href="#inicio"]')?.addEventListener('click', (event) => {
    const hero = document.querySelector('#inicio');
    const header = document.querySelector('.site-header');
    if (!hero || !header) return;
    event.preventDefault();
    window.scrollTo({
        top: hero.offsetTop + (hero.offsetHeight / 2) - header.offsetHeight,
        behavior: 'smooth'
    });
});
