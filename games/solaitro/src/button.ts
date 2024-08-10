import { Theme } from './theme';
import { Coordinates, GameComponent, RenderConfig, Size } from './types';

export class GameButton extends GameComponent {
    renderConfig: RenderConfig;

    constructor(
        ctx: CanvasRenderingContext2D,
        coordinates: Coordinates,
        public size: Size,
        public id: string,
        public text: string,
        public padding: number,
        public fillColor: string
    ) {
        super(ctx, coordinates);
        this.renderConfig = {
            coordinates,
            size,
            scale: 1
        };
    }

    update(): void {}

    render(): void {}
}

export class ThemeButton extends GameButton {
    constructor(
        ctx: CanvasRenderingContext2D,
        coordinates: Coordinates,
        public size: Size,
        public padding: number,
        public fillColor: string,
        public theme: Theme
    ) {
        super(ctx, coordinates, size, 'theme', '', padding, fillColor);
        this.renderConfig = {
            coordinates,
            size,
            scale: 1
        };
    }

    update(): void {}
    render(): void {}
}
