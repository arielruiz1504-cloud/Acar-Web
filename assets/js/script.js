const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('#main-menu');
const chatToggle = document.querySelector('.header-cta');
const chatPanel = document.querySelector('#chat-panel');
const chatCloseButtons = document.querySelectorAll('[data-chat-close]');

const setChatState = (isOpen) => {
    if (!chatPanel || !chatToggle) return;
    chatPanel.classList.toggle('is-open', isOpen);
    document.querySelector('.chat-backdrop')?.classList.toggle('is-open', isOpen);
    chatPanel.setAttribute('aria-hidden', String(!isOpen));
    chatToggle.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) chatPanel.querySelector('input')?.focus();
};

if (chatToggle && chatPanel) {
    chatToggle.addEventListener('click', () => setChatState(true));
    chatCloseButtons.forEach((button) => button.addEventListener('click', () => setChatState(false)));
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') setChatState(false);
    });
}

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
