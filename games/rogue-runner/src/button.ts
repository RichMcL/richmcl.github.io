import { State } from './state';
import { Coordinates, GameComponent, RenderConfig, Size } from './types';
import { printText } from './util';

export class GameButton extends GameComponent {
    renderConfig: RenderConfig;
    borderRadius = 5;

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

    update(): void {
        if (this.isClicked()) {
            console.log('Button clicked:', this.id);
        }
    }

    render(coordinates?: Coordinates): void {
        if (coordinates) {
            this.renderConfig.coordinates = coordinates;
        }
        State.getCtx().fillStyle = '#2c2c2c';

        const x = this.renderConfig.coordinates.x;
        const y = this.renderConfig.coordinates.y;
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
            this.renderConfig.coordinates.x + this.padding / 2,
            this.renderConfig.coordinates.y + this.padding * 1.75
        );

        // Draw a border around the button if it's hovered
        if (this.isHoveredOver()) {
            this.renderOutline(6);
        } else {
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

    renderOutline(lineWidth = 3): void {
        const x = this.renderConfig.coordinates.x;
        const y = this.renderConfig.coordinates.y;
        const width = this.size.width;
        const height = this.size.height;
        const radius = this.borderRadius; // Use the same border radius as the element

        // Draw the outline with the same rounded corners
        State.getCtx().strokeStyle = 'white';
        State.getCtx().lineWidth = lineWidth;
        State.getCtx().beginPath();
        State.getCtx().moveTo(x + radius, y);
        State.getCtx().arcTo(x + width, y, x + width, y + height, radius);
        State.getCtx().arcTo(x + width, y + height, x, y + height, radius);
        State.getCtx().arcTo(x, y + height, x, y, radius);
        State.getCtx().arcTo(x, y, x + width, y, radius);
        State.getCtx().closePath();
        State.getCtx().stroke();
    }

    reset(): void {}
}
