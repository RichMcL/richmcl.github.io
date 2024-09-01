import { Pile } from './pile';
import { State } from './state';
import { Coordinates, GameComponent } from './types';
import { BASE_CARD_SCALE, CARD_WIDTH } from './util';

export class PileContainer extends GameComponent {
    piles: Pile[] = [];

    constructor() {
        const coordinates: Coordinates = { x: 300, y: 70 };
        super(coordinates);

        this.renderConfig = {
            coordinates,
            size: {
                width: 720,
                height: 180
            },
            scale: 0
        };
    }

    update(): void {
        this.piles.forEach(pile => pile.update());
    }

    render() {
        // Draw the pile shadow

        State.getCtx().fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.drawRoundedRect(
            State.getCtx(),
            this.renderConfig.coordinates.x,
            this.renderConfig.coordinates.y,
            this.renderConfig.size.width,
            this.renderConfig.size.height,
            10
        );
        State.getCtx().fill();

        //render the piles centered on the pile container
        const y = this.renderConfig.coordinates.y;
        const x = this.renderConfig.coordinates.x;

        const pileWidth = CARD_WIDTH * BASE_CARD_SCALE; // Example width of a single pile
        const numPiles = this.piles.length; // Example number of piles
        const gap = 40; // Gap between piles
        const containerWidth = this.renderConfig.size.width; // Width of the pile container

        // Calculate the total width of all piles including the gaps
        const totalPilesWidth = pileWidth * numPiles + gap * (numPiles - 1);

        // Calculate the starting x-coordinate to center the piles
        const startX = x + (containerWidth - totalPilesWidth) / 2;

        // Position each pile
        for (let i = 0; i < numPiles; i++) {
            const x = startX + i * (pileWidth + gap);
            const y = this.renderConfig.coordinates.y;
            this.piles[i].render({ x, y });
        }
    }

    public initializePiles() {
        this.piles = [];
        this.piles.push(new Pile());
        this.piles.push(new Pile());
        this.piles.push(new Pile());
        this.piles.push(new Pile());

        this.piles.forEach(pile => pile.pushCard(State.getPlayer().drawPile.pop()));
    }

    public createPile() {
        if (this.piles.length >= 5) return;

        const newPile = new Pile();
        newPile.pushCard(State.getPlayer().drawPile.pop());

        this.piles.push(newPile);
    }

    public removePile() {
        if (this.piles.length <= 1) return;

        //take all the cards from the pile and add them to the draw pile
        const pile = this.piles.pop();
        while (pile.cards.length > 0) {
            State.getPlayer().drawPile.push(pile.popCard());
        }
    }

    public drawRoundedRect(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number
    ) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    public doesAnyPileHaveAnimations(): boolean {
        return this.piles.some(pile => pile.cardAnimations.length > 0);
    }
}
