import {CombatOverlord} from '../../overlords/CombatOverlord';
import {Overseer} from '../../Overseer';
import {Directive} from '../Directive';
import {Colony} from '../../Colony';

export abstract class DefenseDirective extends Directive {

	overlord: CombatOverlord;
	overlords: {};

	constructor(flag: Flag, colonyFilter?: (colony: Colony) => boolean) {
		super(flag, colonyFilter);
		(<Overseer>Overmind.overseer).combatPlanner.directives.push(this);
	}


}
