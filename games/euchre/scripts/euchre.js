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
    });
})();
