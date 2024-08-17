import { Theme, Themes } from './theme';
import { Coordinates, GameComponent, RenderConfig, Size } from './types';
import { printText } from './util';

export class GameButton extends GameComponent {
    renderConfig: RenderConfig;

    constructor(
        ctx: CanvasRenderingContext2D,
        coordinates: Coordinates,
        public size: Size,
        public id: string,
        public text: string,
        public padding: number,
        public theme: Theme
    ) {
        super(ctx, coordinates);
        this.renderConfig = {
            coordinates,
            size,
            scale: 1
        };
    }

    update(): void {}

    render(): void {
        this.ctx.fillStyle = this.theme.base;

        this.ctx.fillRect(
            this.coordinates.x,
            this.coordinates.y,
            this.size.width,
            this.size.height
        );

        printText(
            this.ctx,
            this.text,
            this.coordinates.x + this.padding / 2,
            this.coordinates.y + this.padding * 1.75
        );

        // Draw a border around the button if it's hovered
        if (this.isHovered) {
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
                this.coordinates.x,
                this.coordinates.y,
                this.size.width,
                this.size.height
            );
        }
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
        ctx: CanvasRenderingContext2D,
        coordinates: Coordinates,
        public size: Size,
        public padding: number,
        public theme: Theme
    ) {
        super(ctx, coordinates, size, 'theme', '', padding, null);
        this.renderConfig = {
            coordinates,
            size,
            scale: 1
        };
    }

    update(): void {}

    render(): void {
        this.ctx.fillStyle = this.theme.base;
        this.ctx.fillRect(
            this.coordinates.x,
            this.coordinates.y,
            this.size.width,
            this.size.height
        );

        // Draw a border around the button if it's hovered
        if (this.isHovered) {
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
                this.coordinates.x,
                this.coordinates.y,
                this.size.width,
                this.size.height
            );
        }
    }
}

export const createDecrementPlayPileButton = (ctx: CanvasRenderingContext2D, theme: Theme) => {
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
        ctx,
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'decrement-play-pile',
        text,
        padding,
        theme
    );
};

export const createIncrementPlayPileButton = (ctx: CanvasRenderingContext2D, theme: Theme) => {
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
        ctx,
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'increment-play-pile',
        text,
        padding,
        theme
    );
};

export const createDecrementDrawSizeButton = (ctx: CanvasRenderingContext2D, theme: Theme) => {
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
        ctx,
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'decrement-draw-size',
        text,
        padding,
        theme
    );
};

export const createIncrementDrawSizeButton = (ctx: CanvasRenderingContext2D, theme: Theme) => {
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
        ctx,
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'increment-draw-size',
        text,
        padding,
        theme
    );
};

export const createDecrementShufflesButton = (ctx: CanvasRenderingContext2D, theme: Theme) => {
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
        ctx,
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'decrement-shuffles',
        text,
        padding,
        theme
    );
};

export const createIncrementShufflesButton = (ctx: CanvasRenderingContext2D, theme: Theme) => {
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
        ctx,
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'increment-shuffles',
        text,
        padding,
        theme
    );
};

export const createReloadButton = (ctx: CanvasRenderingContext2D, theme: Theme) => {
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
        ctx,
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'reload',
        text,
        padding,
        theme
    );
};

export const createDealButton = (ctx: CanvasRenderingContext2D, theme: Theme) => {
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
        ctx,
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'deal',
        text,
        padding,
        theme
    );
};

export const createHitButton = (ctx: CanvasRenderingContext2D, theme: Theme) => {
    const text = 'HIT';
    const padding = 20; // Padding for the button

    ctx.font = '20px Balatro';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 710;
    const y = 490;

    return new GameButton(
        ctx,
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'hit',
        text,
        padding,
        theme
    );
};

export const createFreeButtton = (ctx: CanvasRenderingContext2D, theme: Theme) => {
    const text = 'FREE';
    const padding = 20; // Padding for the button

    ctx.font = '20px Balatro';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding;
    const buttonHeight = 50;
    const x = 650;
    const y = 480;

    return new GameButton(
        ctx,
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'free',
        text,
        padding,
        theme
    );
};

export const createOpenDialogButton = (ctx: CanvasRenderingContext2D, theme: Theme) => {
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
        ctx,
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'dialog-open',
        text,
        padding,
        theme
    );
};

export const createCloseDialogButton = (ctx: CanvasRenderingContext2D, theme: Theme) => {
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
        ctx,
        { x, y },
        { width: buttonWidth, height: buttonHeight },
        'dialog-close',
        text,
        padding,
        theme
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
            ctx,
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
