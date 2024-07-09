function reload() {
    window.location.reload();
}

function toggleScroll() {
    const hidden = document.querySelector('body').style.overflow;
    if (hidden === 'auto') {
        document.querySelector('body').style.overflow = 'hidden';
        return;
    }
    document.querySelector('body').style.overflow = 'auto';
}

function toggleGrid() {
    const display = document.querySelector('#layout-grid').style.display;
    if (display === 'none') {
        document.querySelector('#layout-grid').style.display = 'block';
        return;
    }
    document.querySelector('#layout-grid').style.display = 'none';
}
function toggleDebug() {
    const debugMenu = document.querySelector('#debug-menu');
    debugMenu.classList.toggle('hidden');
}

function reDeal() {
    const game = new Game();
    window.game = game;
}

(() => {
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.reload-button').forEach(button => {
            button.addEventListener('click', reload);
        });

        document.querySelectorAll('.scroll-button').forEach(button => {
            button.addEventListener('click', toggleScroll);
        });

        document.querySelectorAll('.grid-button').forEach(button => {
            button.addEventListener('click', toggleGrid);
        });

        document.querySelectorAll('.deal-button').forEach(button => {
            button.addEventListener('click', reDeal);
        });

        document.querySelectorAll('.debug-button, .close-debug-button').forEach(button => {
            button.addEventListener('click', toggleDebug);
        });
    });
})();
