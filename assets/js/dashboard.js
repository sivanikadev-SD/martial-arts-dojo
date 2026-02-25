/* 
  Martial Arts Dojo - Dashboard JavaScript
  Features: Belt Progress Tracker, Stats Charts (Chart.js Placeholder), Notifications
*/

document.addEventListener('DOMContentLoaded', () => {
    initBeltTracker();
    initStats();
    initNotifications();
});

/**
 * Belt Progress Tracker Logic
 */
function initBeltTracker() {
    const progressFill = document.querySelector('.belt-progress__fill');
    const progressText = document.querySelector('.belt-progress__value');
    if (!progressFill || !progressText) return;

    // Simulate progress update
    let current = 0;
    const target = 75; // 75% progress to next belt

    const interval = setInterval(() => {
        if (current >= target) {
            clearInterval(interval);
        } else {
            current++;
            progressFill.style.width = `${current}%`;
            progressText.textContent = `${current}%`;
        }
    }, 20);
}

/**
 * Statistics Rendering (Placeholders)
 */
function initStats() {
    const charts = document.querySelectorAll('.stat-chart-placeholder');
    charts.forEach(chart => {
        // In a real app, integrate Chart.js here
        // For template: simple CSS bars or SVG mocks
    });
}

/**
 * Simple Notification UI Toggler
 */
function initNotifications() {
    const bell = document.querySelector('.nav-bell');
    const panel = document.querySelector('.notifications-panel');

    if (bell && panel) {
        bell.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('panel--active');
        });

        document.addEventListener('click', () => {
            panel.classList.remove('panel--active');
        });
    }
}
