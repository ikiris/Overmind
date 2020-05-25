// High-level planning for skirmishing and combats

import {log} from '../console/log';

import {CombatIntel, CombatPotentials} from '../intel/CombatIntel';
import {RoomIntel} from '../intel/RoomIntel';

import {Graph} from '../algorithms/Graph'

export class EncounterPlanner {
	encounters: Encounter[];
	roomName: string;
	pos: RoomPosition;
	room: Room | undefined;
	creeps: CombatZerg[];

	constructor() {
		_.defaults(this.memory, defaultEncounterPlannerMemory);
		this.creeps = [];
	}

	init() {
		for (const encounter of this.encounters) {
			this.refreshEncounter(encounter);
		}
	}
}

export class Encounter {
	id: string;
	graph: Graph;
	creeps: CombatZerg[];
	
	init(): {
		
	}
}