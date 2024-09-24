import { State } from './state';

export interface Coordinates {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}
export interface RenderConfig {
    coordinates: Coordinates;
    size: Size;
    scale: number;
}

export abstract class GameComponent {
    update(): void {}
    render(coordinates?: Coordinates): void {}
    reset(): void {}

    renderConfig: RenderConfig;

    deleteMe = false;

    constructor(public coordinates: Coordinates) {}

    isHoveredOver(): boolean {
        const scaledMouseCoordinates = State.getScaledMouseCoordinates();

        return (
            scaledMouseCoordinates?.x >= this.renderConfig.coordinates.x &&
            scaledMouseCoordinates?.x <=
                this.renderConfig.coordinates.x +
                    this.renderConfig.size.width * this.renderConfig.scale &&
            scaledMouseCoordinates?.y >= this.renderConfig.coordinates.y &&
            scaledMouseCoordinates?.y <=
                this.renderConfig.coordinates.y +
                    this.renderConfig.size.height * this.renderConfig.scale
        );
    }

    isClickedOver(): boolean {
        const scaledClickCoordinates = State.getScaledClickCoordinates();

        return (
            scaledClickCoordinates?.x >= this.renderConfig.coordinates.x &&
            scaledClickCoordinates?.x <=
                this.renderConfig.coordinates.x +
                    this.renderConfig.size.width * this.renderConfig.scale &&
            scaledClickCoordinates?.y >= this.renderConfig.coordinates.y &&
            scaledClickCoordinates?.y <=
                this.renderConfig.coordinates.y +
                    this.renderConfig.size.height * this.renderConfig.scale
        );
    }

    isClicked(): boolean {
        return (
            (this.isHoveredOver() && (State.isMouseClick() || State.isGamepadButtonClick())) ||
            this.isClickedOver()
        );
    }

    getCoordinatesCopy(): Coordinates {
        return { ...this.coordinates };
    }
}
