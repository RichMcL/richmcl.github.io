import { State } from './state';
import { GameComponent, RenderConfig } from './types';

export class Player extends GameComponent {
    renderConfig: RenderConfig;

    constructor() {
        super({ x: null, y: null });
    }

    update(): void {}

    render(): void {}
}
