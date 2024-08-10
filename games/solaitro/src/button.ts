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

export const createReloadButton = (ctx: CanvasRenderingContext2D, theme: Theme) => {
    const text = 'RELOAD';
    const padding = 20; // Padding for the button
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding * 2 + 5;
    const buttonHeight = 50;
    const x = 30;
    const y = 730;

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
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding * 2;
    const buttonHeight = 50;
    const x = 30;
    const y = 670;

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
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding * 2;
    const buttonHeight = 50;
    const x = 610;
    const y = 390;

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
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const buttonWidth = textWidth + padding * 2;
    const buttonHeight = 50;
    const x = 1100;
    const y = 670;

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

export const createThemeButtons = (ctx: CanvasRenderingContext2D): ThemeButton[] => {
    const themeButtons: ThemeButton[] = [];
    let i = 0;

    for (const theme of Object.keys(Themes)) {
        const padding = 20; // Padding for the button
        const buttonWidth = 50;
        const buttonHeight = 50;
        const x = 400 + i * (buttonWidth + padding);
        const y = 700;

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
