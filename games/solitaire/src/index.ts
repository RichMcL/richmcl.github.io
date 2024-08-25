import { Game } from './solitaire';

(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const game = new Game();
        (window as any).game = game;

        // Initial scale
        game.scaleGame();

        // Scale the game on window resize
        window.addEventListener('resize', () => game.scaleGame());
    });
})();
