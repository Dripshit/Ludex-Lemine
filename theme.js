// LUDEX LEMINE - Theme Toggle Logic
// The anti-flash IIFE is inlined in each page's <head> so it runs before CSS paints.

function toggleTheme() {
    var html = document.documentElement;
    var isDark = html.getAttribute('data-theme') === 'dark';
    if (isDark) {
        html.removeAttribute('data-theme');
        localStorage.setItem('ludex_theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('ludex_theme', 'dark');
    }
    updateAllThemeToggles();
}

function updateAllThemeToggles() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var icon  = isDark ? '☀️' : '🌙';
    var label = isDark ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro';
    document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
        if (btn.classList.contains('nav-theme-btn')) {
            btn.innerHTML = icon + ' ' + (isDark ? 'Modo Claro' : 'Modo Escuro');
        } else {
            btn.textContent = icon;
        }
        btn.setAttribute('aria-label', label);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    updateAllThemeToggles();
    document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
        btn.addEventListener('click', toggleTheme);
    });
});
