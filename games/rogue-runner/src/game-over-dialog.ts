import { GameButton } from './button';
import { State } from './state';
import { Coordinates, GameComponent, RenderConfig } from './types';
import { GAME_BASE_HEIGHT, GAME_BASE_WIDTH, printText } from './util';

export const DefaultDialogRenderConfig: RenderConfig = {
    coordinates: {
        x: 60,
        y: 200
    },
    size: {
        width: GAME_BASE_WIDTH - 120,
        height: 520
    },
    scale: 1
};

export class GameOverDialog extends GameComponent {
    text: string = 'Game Over';
    buttons: GameButton[] = [];

    constructor(coordinates: Coordinates) {
        super(coordinates);

        this.buttons.push(
            this.createButton({
                text: 'Play Again',
                id: 'play-again'
            })
        );
    }

    update(): void {
        this.buttons.forEach(button => {
            button.update();

            if (button.isClicked()) {
                switch (button.id) {
                    case 'play-again':
                        console.log('Play again button clicked');
                        window.location.reload();
                        break;
                }
            }
        });
    }

    render(): void {
        const ctx = State.getCtx();
        // Save the current context state
        ctx.save();

        ctx.fillStyle = '#2c2c2c';
        ctx.fillRect(
            this.coordinates.x,
            this.coordinates.y,
            DefaultDialogRenderConfig.size.width,
            DefaultDialogRenderConfig.size.height
        );

        // Add a white outline
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3; // Set the width of the outline
        ctx.strokeRect(
            this.coordinates.x,
            this.coordinates.y,
            DefaultDialogRenderConfig.size.width,
            DefaultDialogRenderConfig.size.height
        );

        const text = this.text;
        const fontSize = 30;
        const dialogWidth = DefaultDialogRenderConfig.size.width;

        // Set the font size for measuring the text
        ctx.font = `${fontSize}px Base-Font`;

        // Measure the width of the text
        const textWidth = ctx.measureText(text).width;

        // Calculate the x-coordinate to center the text horizontally
        const x = this.coordinates.x + (dialogWidth - textWidth) / 2;

        // Calculate the y-coordinate to center the text vertically
        const y = this.coordinates.y + 80;

        // Print the text centered inside the dialog
        printText(text, x, y, fontSize);
        ctx.restore();

        //center the button horizontally
        const button = this.buttons[0];
        const buttonWidth = button.size.width;
        const buttonX = this.coordinates.x + (dialogWidth - buttonWidth) / 2;
        button.render({ x: buttonX, y: this.coordinates.y + 400 });
    }

    private createButton(params: { text: string; id: string; x?: number; y?: number }): GameButton {
        const ctx = State.getCtx();
        const padding = 20; // Padding for the button

        ctx.font = '30px Base-Font';
        const textMetrics = ctx.measureText(params.text);
        const textWidth = textMetrics.width;
        const buttonWidth = textWidth + padding;
        const buttonHeight = 50;

        return new GameButton(
            { x: params.x, y: params.y },
            { width: buttonWidth, height: buttonHeight },
            params.id,
            params.text,
            padding
        );
    }
}
