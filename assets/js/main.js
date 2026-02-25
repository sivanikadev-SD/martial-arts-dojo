/* 
  Martial Arts Dojo - Main JS
  Handles: Theme Toggle, RTL Switch, Mobile Menu, Header Scroll
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    const savedTheme = localStorage.getItem('theme') || (prefersDark.matches ? 'dark' : 'light');
    setTheme(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    // 2. RTL Toggle Logic
    const rtlBtn = document.getElementById('rtl-toggle');
    const setDir = (dir) => {
        document.documentElement.setAttribute('dir', dir);
        if (rtlBtn) {
            rtlBtn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
        }
    };

    if (rtlBtn) {
        // Initialize text
        const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
        rtlBtn.textContent = currentDir === 'rtl' ? 'LTR' : 'RTL';

        rtlBtn.addEventListener('click', () => {
            const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
            setDir(currentDir === 'rtl' ? 'ltr' : 'rtl');
        });
    }

    // 3. Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header?.classList.add('header--scrolled');
        } else {
            header?.classList.remove('header--scrolled');
        }
    });

    // 4. Mobile Menu
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-links--active');

            // Burger Animation
            burger.classList.toggle('toggle');
        });

        // Close menu when clicking links
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav-links--active');
                burger.classList.remove('toggle');
            });
        });
    }

    // 5. Toast System
    const createToastContainer = () => {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    };

    window.showToast = (message, type = 'success') => {
        const container = createToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;

        const icon = type === 'success' ? '🥋' : '⚠️';

        toast.innerHTML = `
            <span class="toast__icon">${icon}</span>
            <span class="toast__msg">${message}</span>
        `;

        container.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('active'), 10);

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    };

    // Check for login/logout messages in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('msg') === 'login_success') window.showToast('Welcome back, Warrior!');
    if (urlParams.get('msg') === 'logout_success') window.showToast('Logged out successfully. Stay disciplined!');
    if (urlParams.get('msg') === 'register_success') window.showToast('Registration complete. Welcome to DojoX!');
});
