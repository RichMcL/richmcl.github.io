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

function scaleGame() {
    const gameAspectRatio = 1280 / 800;
    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;
    const windowAspectRatio = currentWidth / currentHeight;
    let scaleFactor;

    // Determine the scale factor
    if (windowAspectRatio > gameAspectRatio) {
        // Window is wider than game aspect ratio
        scaleFactor = currentHeight / 800;
    } else {
        // Window is narrower than game aspect ratio
        scaleFactor = currentWidth / 1280;
    }

    // Apply the scale factor to the game container
    const gameContainer = document.getElementById('game-board');
    gameContainer.style.transform = `scale(${scaleFactor})`;
    gameContainer.style.transformOrigin = 'top left';
    gameContainer.style.width = `${1280}px`;
    gameContainer.style.height = `${800}px`;
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

        // Initial scale
        scaleGame();

        // Scale the game on window resize
        window.addEventListener('resize', scaleGame);
    });
})();
