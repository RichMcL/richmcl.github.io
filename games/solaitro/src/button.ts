import { State } from './state';
import { Theme, Themes } from './theme';
import { Coordinates, GameComponent, RenderConfig, Size } from './types';
import { printText } from './util';

export class GameButton extends GameComponent {
    renderConfig: RenderConfig;
    borderRadius = 5;
    theme = State.getTheme();

    constructor(
        coordinates: Coordinates,
        public size: Size,
        public id: string,
        public text: string,
        public padding: number
    ) {
        super(coordinates);
        this.renderConfig = {
            coordinates,
            size,
            scale: 1
        };
    }

    update(): void {}

    render(): void {
        this.renderDropShadow();
        State.getCtx().fillStyle = this.theme.base;

        const x = this.coordinates.x;
        const y = this.coordinates.y;
        const width = this.size.width;
        const height = this.size.height;
        const radius = this.borderRadius; // Adjust the radius as needed

        State.getCtx().beginPath();
        State.getCtx().moveTo(x + radius, y);
        State.getCtx().arcTo(x + width, y, x + width, y + height, radius);
        State.getCtx().arcTo(x + width, y + height, x, y + height, radius);
        State.getCtx().arcTo(x, y + height, x, y, radius);
        State.getCtx().arcTo(x, y, x + width, y, radius);
        State.getCtx().closePath();
        State.getCtx().fill();

        printText(
            this.text,
            this.coordinates.x + this.padding / 2,
            this.coordinates.y + this.padding * 1.75
        );

        // Draw a border around the button if it's hovered
        if (this.isHovered) {
            this.renderOutline();
        }
    }

    renderDropShadow(): void {
        State.getCtx().save();
        State.getCtx().fillStyle = 'rgba(0, 0, 0, 0.3)';

        const x = this.renderConfig.coordinates.x;
        const y = this.renderConfig.coordinates.y;
        const width = this.renderConfig.size.width * this.renderConfig.scale;
        const height = this.renderConfig.size.height * this.renderConfig.scale;
        const radius = this.borderRadius; // Adjust the radius as needed

        // Determine the shadow offset based on the element's position relative to the center
        const shadowOffsetX = 5; // Reduced horizontal offset
        const shadowOffsetY = 5; // Fixed vertical offset

        // Apply the shadow offset
        const shadowX = x + shadowOffsetX;
        const shadowY = y + shadowOffsetY;

        State.getCtx().beginPath();
        State.getCtx().moveTo(shadowX + radius, shadowY);
        State.getCtx().arcTo(shadowX + width, shadowY, shadowX + width, shadowY + height, radius);
        State.getCtx().arcTo(shadowX + width, shadowY + height, shadowX, shadowY + height, radius);
        State.getCtx().arcTo(shadowX, shadowY + height, shadowX, shadowY, radius);
        State.getCtx().arcTo(shadowX, shadowY, shadowX + width, shadowY, radius);
        State.getCtx().closePath();
        State.getCtx().fill();

        State.getCtx().restore();
    }

    renderOutline(): void {
        const x = this.coordinates.x;
        const y = this.coordinates.y;
        const width = this.size.width;
        const height = this.size.height;
        const radius = this.borderRadius; // Use the same border radius as the element

        // Draw the outline with the same rounded corners
        State.getCtx().strokeStyle = 'white';
        State.getCtx().lineWidth = 3;
        State.getCtx().beginPath();
        State.getCtx().moveTo(x + radius, y);
        State.getCtx().arcTo(x + width, y, x + width, y + height, radius);
        State.getCtx().arcTo(x + width, y + height, x, y + height, radius);
        State.getCtx().arcTo(x, y + height, x, y, radius);
        State.getCtx().arcTo(x, y, x + width, y, radius);
        State.getCtx().closePath();
        State.getCtx().stroke();
    }

    reset(): void {
        this.isHovered = false;
    }

    setTheme(theme: Theme): void {
        this.theme = theme;
    }
}

export class ThemeButton extends GameButton {
    constructor(
        coordinates: Coordinates,
        public size: Size,
        public padding: number,
        public theme: Theme
    ) {
        super(coordinates, size, 'theme', '', padding);
        this.renderConfig = {
            coordinates,
            size,
            scale: 1
        };
    }

    update(): void {}

    render(): void {
        State.getCtx().fillStyle = this.theme.base;
        State.getCtx().fillRect(
            this.coordinates.x,
            this.coordinates.y,
            this.size.width,
            this.size.height
        );

        // Draw a border around the button if it's hovered
        if (this.isHovered) {
            State.getCtx().strokeStyle = 'white';
            State.getCtx().lineWidth = 2;
            State.getCtx().strokeRect(
                this.coordinates.x,
                this.coordinates.y,
                this.size.width,
                this.size.height
            );
        }
    }
}

export const createDecrementPlayPileButton = (ctx: CanvasRenderingContext2D) => {
    const text = 'Play Pile -';
    const padding = 20; // Padding for the button

    ctx.font = '20px Balatro';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 400;
    const y = 410;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'decrement-play-pile',
        text,
        padding
    );
};

export const createIncrementPlayPileButton = (ctx: CanvasRenderingContext2D) => {
    const text = 'Play Pile +';
    const padding = 20; // Padding for the button

    ctx.font = '20px Balatro';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 540;
    const y = 410;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'increment-play-pile',
        text,
        padding
    );
};

export const createDecrementDrawSizeButton = (ctx: CanvasRenderingContext2D) => {
    const text = 'Draw Size -';
    const padding = 20; // Padding for the button

    ctx.font = '20px Balatro';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 400;
    const y = 270;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'decrement-draw-size',
        text,
        padding
    );
};

export const createIncrementDrawSizeButton = (ctx: CanvasRenderingContext2D) => {
    const text = 'Draw Size +';
    const padding = 20; // Padding for the button

    ctx.font = '20px Balatro';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 540;
    const y = 270;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'increment-draw-size',
        text,
        padding
    );
};

export const createDecrementShufflesButton = (ctx: CanvasRenderingContext2D) => {
    const text = 'Shuffles -';
    const padding = 20; // Padding for the button

    ctx.font = '20px Balatro';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 400;
    const y = 340;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'decrement-shuffles',
        text,
        padding
    );
};

export const createIncrementShufflesButton = (ctx: CanvasRenderingContext2D) => {
    const text = 'Shuffles +';
    const padding = 20; // Padding for the button

    ctx.font = '20px Balatro';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 540;
    const y = 340;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'increment-shuffles',
        text,
        padding
    );
};

export const createReloadButton = (ctx: CanvasRenderingContext2D) => {
    const text = 'RELOAD';
    const padding = 20; // Padding for the button

    ctx.font = '20px Balatro';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 400;
    const y = 480;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'reload',
        text,
        padding
    );
};

export const createDealButton = (ctx: CanvasRenderingContext2D) => {
    const text = 'DEAL';
    const padding = 20; // Padding for the button

    ctx.font = '20px Balatro';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 540;
    const y = 480;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'deal',
        text,
        padding
    );
};

export const createHitButton = (ctx: CanvasRenderingContext2D) => {
    const text = 'HIT';
    const padding = 20; // Padding for the button

    ctx.font = '20px Balatro';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 835;
    const y = 570;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'hit',
        text,
        padding
    );
};

export const createDeckButton = (ctx: CanvasRenderingContext2D) => {
    const text = 'DECK';
    const padding = 20; // Padding for the button

    ctx.font = '20px Balatro';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 835;
    const y = 640;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'deck-dialog-open',
        text,
        padding
    );
};

export const createSameValueButton = (ctx: CanvasRenderingContext2D) => {
    const text = 'SAME VALUE';
    const padding = 20; // Padding for the button

    ctx.font = '20px Balatro';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 800;
    const y = 240;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'same-value',
        text,
        padding
    );
};

export const createFlushButton = (ctx: CanvasRenderingContext2D) => {
    const text = 'FLUSH';
    const padding = 20; // Padding for the button

    ctx.font = '20px Balatro';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 800;
    const y = 300;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'flush',
        text,
        padding
    );
};

export const createReverseKlondikeButton = (ctx: CanvasRenderingContext2D) => {
    const text = 'REV. KLONDIKE';
    const padding = 20; // Padding for the button

    ctx.font = '20px Balatro';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 800;
    const y = 360;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'reverse-klondike',
        text,
        padding
    );
};

export const createKlondikeButton = (ctx: CanvasRenderingContext2D) => {
    const text = 'KLONDIKE';
    const padding = 20; // Padding for the button

    ctx.font = '20px Balatro';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 800;
    const y = 420;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'klondike',
        text,
        padding
    );
};

export const createFreeButtton = (ctx: CanvasRenderingContext2D) => {
    const text = 'FREE';
    const padding = 20; // Padding for the button

    ctx.font = '20px Balatro';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 800;
    const y = 480;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'free',
        text,
        padding
    );
};

export const createOpenDialogButton = (ctx: CanvasRenderingContext2D) => {
    const text = 'DEBUG';
    const padding = 20; // Padding for the button

    ctx.font = '20px Balatro';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 1100;
    const y = 720;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'dialog-open',
        text,
        padding
    );
};

export const createCloseDialogButton = (ctx: CanvasRenderingContext2D) => {
    const text = 'CLOSE';
    const padding = 20; // Padding for the button

    ctx.font = '20px Balatro';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 1000;
    const y = 570;

    return new GameButton(
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'dialog-close',
        text,
        padding
    );
};

export const createThemeButtons = (ctx: CanvasRenderingContext2D): ThemeButton[] => {
    const themeButtons: ThemeButton[] = [];
    let i = 0;

    for (const theme of Object.keys(Themes)) {
        const padding = 20; // Padding for the button
        const buttonWidth = 50;
        const buttonHeight = 50;
        const x = 400 + i * (buttonWidth + padding);
        const y = 570;

        const themeButton = new ThemeButton(
            { x, y },
            { width: buttonWidth, height: buttonHeight },
            padding,
            Themes[theme]
        );

        themeButtons.push(themeButton);

        i++;
    }

    return themeButtons;
};
