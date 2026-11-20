(function () {
    'use strict';

    function initHomeAdminForms() {
        const loginForm = document.getElementById('homeAdminLoginForm');
        const registerForm = document.getElementById('homeAdminRegisterForm');
        if (!loginForm || !registerForm) return;

        const messageEl = document.getElementById('homeAdminAuthMessage');

        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const user = document.getElementById('homeAdminLoginUser').value.trim();
            const password = document.getElementById('homeAdminLoginPassword').value.trim();
            const users = JSON.parse(localStorage.getItem('urban-bistro-users') || '[]');
            const found = users.find(item => item.user === user && item.password === password);

            if (found) {
                localStorage.setItem('urban-bistro-admin-session', user.toLowerCase() === 'admin' ? 'admin' : 'user');
                messageEl.textContent = 'Ingresaste correctamente. Ya puedes hacer tu pedido en el menú.';
            } else {
                messageEl.textContent = 'Usuario o contraseña incorrectos.';
            }
        });

        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const user = document.getElementById('homeAdminRegisterUser').value.trim();
            const email = document.getElementById('homeAdminRegisterEmail').value.trim();
            const password = document.getElementById('homeAdminRegisterPassword').value.trim();
            const users = JSON.parse(localStorage.getItem('urban-bistro-users') || '[]');

            if (!user || !email || !password || password.length < 4) {
                messageEl.textContent = 'Completa todos los campos y usa una contraseña de al menos 4 caracteres.';
                return;
            }

            const exists = users.some(item => item.user === user || item.email === email);
            if (exists) {
                messageEl.textContent = 'Ese usuario o correo ya está registrado.';
                return;
            }

            users.push({ user, email, password });
            localStorage.setItem('urban-bistro-users', JSON.stringify(users));
            messageEl.textContent = 'Registro exitoso. Ya puedes ingresar.';
            registerForm.reset();
        });
    }

    function initCarousel() {
        const slides = Array.from(document.querySelectorAll('.carrusel-slide'));
        const dots = Array.from(document.querySelectorAll('.dot'));
        const prevBtn = document.querySelector('.carrusel-btn.prev');
        const nextBtn = document.querySelector('.carrusel-btn.next');
        if (slides.length === 0) return;

        let current = 0;

        function show(index) {
            if (index >= slides.length) index = 0;
            if (index < 0) index = slides.length - 1;
            slides.forEach((s, i) => { s.style.display = i === index ? 'block' : 'none'; });
            dots.forEach((d, i) => { d.classList.toggle('active', i === index); });
            current = index;
        }

        prevBtn && prevBtn.addEventListener('click', () => show(current - 1));
        nextBtn && nextBtn.addEventListener('click', () => show(current + 1));

        dots.forEach(d => d.addEventListener('click', (e) => {
            const idx = Number(e.currentTarget.getAttribute('data-index'));
            if (!Number.isNaN(idx)) show(idx);
        }));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') show(current - 1);
            if (e.key === 'ArrowRight') show(current + 1);
        });

        show(0);
    }

    document.addEventListener('DOMContentLoaded', () => {
        initHomeAdminForms();
        initCarousel();
    });

})();