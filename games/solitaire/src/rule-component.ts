import { Rule, RuleInfo, RuleNames } from './rules';
import { State } from './state';
import { Coordinates, GameComponent } from './types';
import { drawRule, printText, RULE_HEIGHT, RULE_SCALE, RULE_WIDTH } from './util';

export class RuleComponent extends GameComponent {
    rule: RuleNames;
    borderRadius = 5;

    constructor(params: { coordinates?: Coordinates; rule: RuleNames }) {
        const { coordinates, rule } = params;
        super(coordinates);

        this.renderConfig = {
            coordinates,
            size: {
                width: RULE_WIDTH,
                height: RULE_HEIGHT
            },
            scale: RULE_SCALE
        };
        this.rule = rule;
    }

    update(): void {}

    render(coordinates: Coordinates): void {
        this.renderConfig.coordinates = coordinates;

        let y = this.renderConfig.coordinates.y;
        let x = this.renderConfig.coordinates.x;
        drawRule(this.rule, x, y);
    }

    renderOutline(coordinates: Coordinates): void {
        const x = coordinates.x;
        const y = coordinates.y;
        const width = this.renderConfig.size.width * this.renderConfig.scale;
        const height = this.renderConfig.size.height * this.renderConfig.scale;
        const radius = this.borderRadius; // Use the same border radius as the element
        const ctx = State.getCtx();

        // Draw the outline with the same rounded corners
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
        ctx.stroke();
    }

    /**
     * Rule description is not rendererd with the component itself, but rather
     * but the rule sidebar so that the tooltip is on top of all rules.
     */
    renderRuleDescription(): void {
        const ctx = State.getCtx();
        const scaledMouseCoordinates = State.getScaledMouseCoordinates();
        const x = scaledMouseCoordinates.x + 5;
        const y = scaledMouseCoordinates.y;

        const ruleInfo: Rule = RuleInfo[this.rule];

        // printText('Rule Description', x, y, 20, 'white');
        const padding = 10;
        const fontSize = 20;
        ctx.font = `${fontSize}px New-Amsterdam`;
        const textWidth = ctx.measureText(ruleInfo.description).width;
        const textHeight = fontSize;

        // Draw background rectangle
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        // ctx.fillRect(x, y - textHeight, textWidth + padding * 2, textHeight + padding * 2);
        ctx.fillRect(x, y + textHeight, textWidth + padding * 2, 60);

        printText(ruleInfo.name, x + padding, y + 45 + padding / 2);
        printText(ruleInfo.description, x + padding, y + 45 + padding / 2 + textHeight, 20);
    }
}
