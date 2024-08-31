import { Rule, RuleInfo, RuleNames } from './rules';
import { Coordinates, GameComponent } from './types';
import { drawRule, printText } from './util';

export class RuleComponent extends GameComponent {
    rule: RuleNames;

    constructor(params: { coordinates?: Coordinates; rule: RuleNames }) {
        const { coordinates, rule } = params;
        super(coordinates);
        this.rule = rule;
    }

    update(): void {}

    render(coordinates: Coordinates): void {
        let y = coordinates.y;
        drawRule(this.rule, coordinates.x + 30, y);
        y += 90;
        const ruleInfo: Rule = RuleInfo[this.rule];
        printText(`- ${ruleInfo.name}`, coordinates.x + 30, y);
        y += 30;
        printText(`  ${ruleInfo.description}`, coordinates.x + 30, y, 20);
    }
}
