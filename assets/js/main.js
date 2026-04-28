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

    // Global listener for theme toggle (handles mobile and dashboard sidebar)
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.theme-toggle-mobile');
        if (btn) {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        }
    });

    // 2. RTL Toggle Logic
    const rtlBtn = document.getElementById('rtl-toggle');
    const setDir = (dir) => {
        document.documentElement.setAttribute('dir', dir);
        if (rtlBtn) {
            rtlBtn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
        }
        // Update all RTL buttons (including mobile and dashboard)
        document.querySelectorAll('.rtl-toggle-mobile').forEach(btn => {
            const icon = btn.querySelector('i') || btn.querySelector('svg');
            if (icon) {
                // If there's an icon, preserve it and update the following text
                const text = dir === 'rtl' ? ' LTR' : ' RTL';
                const span = btn.querySelector('span');
                if (span) {
                    span.textContent = text;
                } else {
                    // Fallback: keep icon and replace other child nodes
                    Array.from(btn.childNodes).forEach(node => {
                        if (node !== icon) node.remove();
                    });
                    btn.appendChild(document.createTextNode(text));
                }
            } else {
                btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
            }
        });
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

    // Global listener for RTL toggle (handles mobile and dashboard sidebar)
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.rtl-toggle-mobile');
        if (btn) {
            const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
            setDir(currentDir === 'rtl' ? 'ltr' : 'rtl');
        }
    });

    // 3. Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header?.classList.add('header--scrolled');
        } else {
            header?.classList.remove('header--scrolled');
        }
    });

    // 4. Mobile Menu & Responsive Navigation
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const headerNav = document.querySelector('.nav.container');
    const sidebar = document.querySelector('aside nav');

    if (burger && headerNav) {
        // 4a. Ensure nav-links container exists
        let currentNavLinks = navLinks;
        if (!currentNavLinks) {
            currentNavLinks = document.createElement('ul');
            currentNavLinks.className = 'nav-links';
            headerNav.insertBefore(currentNavLinks, burger);
        }

        // 4b. Contextual link helper
        const isSubPage = window.location.pathname.includes('/pages/');
        const prefix = isSubPage ? '' : 'pages/';
        const root = isSubPage ? '../' : '';

        // 4c. Populate regular site links if empty
        if (currentNavLinks.children.length === 0) {
            const links = [
                { name: 'Home', url: root + 'index.html' },
                { name: 'About', url: prefix + 'about.html' },
                { name: 'Programs', url: prefix + 'programs.html' },
                { name: 'Pricing', url: prefix + 'pricing.html' },
                { name: 'Blog', url: prefix + 'blog.html' },
                { name: 'Contact', url: prefix + 'contact.html' }
            ];
            
            links.forEach(l => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="${l.url}">${l.name}</a>`;
                currentNavLinks.appendChild(li);
            });
        }

        // 4d. Clone sidebar items to mobile menu (for dashboards)
        if (sidebar) {
            const sidebarItems = sidebar.querySelectorAll('.dash-nav-item');
            if (sidebarItems.length > 0) {
                const divider = document.createElement('li');
                divider.className = 'mobile-only';
                divider.innerHTML = `<hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 15px 0; width: 100%;">`;
                currentNavLinks.appendChild(divider);

                sidebarItems.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'mobile-only';
                    const clone = item.cloneNode(true);
                    
                    // Close menu when clicking dashboard items
                    clone.addEventListener('click', () => {
                        currentNavLinks.classList.remove('nav-links--active');
                        burger.classList.remove('toggle');
                    });
                    
                    li.appendChild(clone);
                    currentNavLinks.appendChild(li);
                });

                // Re-initialize icons for the newly cloned items
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            }
        }

        // 4e. Inject mobile-only buttons (Theme/RTL/Login)
        if (!currentNavLinks.querySelector('.mobile-controls')) {
            const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
            const rtlText = currentDir === 'rtl' ? 'LTR' : 'RTL';
            
            const mobileControls = document.createElement('li');
            mobileControls.className = 'mobile-controls';
            mobileControls.innerHTML = `
                <button class="theme-toggle-mobile">🌓 Theme</button>
                <button class="rtl-toggle-mobile">${rtlText}</button>
            `;
            currentNavLinks.appendChild(mobileControls);
        }

        if (!currentNavLinks.querySelector('.mobile-login-link') && !window.location.pathname.includes('dashboard-')) {
            const loginLi = document.createElement('li');
            loginLi.className = 'mobile-login-link';
            const loginHref = prefix + 'login.html';
            loginLi.innerHTML = `<a href="${loginHref}" style="color: var(--primary-red); font-weight: 700; border: 1px solid var(--primary-red); padding: 10px 30px; border-radius: 8px; margin-top: 10px;">LOGIN</a>`;
            currentNavLinks.insertBefore(loginLi, currentNavLinks.querySelector('.mobile-controls'));
        }

        // 4f. Burger Click Logic
        burger.addEventListener('click', () => {
            currentNavLinks.classList.toggle('nav-links--active');
            burger.classList.toggle('toggle');
        });

        // Close menu when clicking links
        currentNavLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                currentNavLinks.classList.remove('nav-links--active');
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
