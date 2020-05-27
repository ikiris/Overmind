import {Colony} from '../../Colony';
import {log} from '../../console/log';
import {Roles} from '../../creepSetups/setups';
import {RoomIntel} from '../../intel/RoomIntel';
import {ClaimingOverlord} from '../../overlords/colonization/claimer';
import {PioneerOverlord} from '../../overlords/colonization/pioneer';
import {StationaryScoutOverlord} from '../../overlords/scouting/stationary';
import {profile} from '../../profiler/decorator';
import {Cartographer, ROOMTYPE_CONTROLLER} from '../../utilities/Cartographer';
import {printRoomName} from '../../utilities/utils';
import {MY_USERNAME} from '../../~settings';
import {Directive} from '../Directive';


/**
 * Claims a new room and builds a spawn but does not incubate. Removes when spawn is constructed.
 */
@profile
export class DirectiveColonize extends Directive {

	static directiveName = 'colonize';
	static color = COLOR_PURPLE;
	static secondaryColor = COLOR_GREY;

	static requiredRCL = 3;

	toColonize: Colony | undefined;

	constructor(flag: Flag) {
		flag.memory.allowPortals = true;
		super(flag, colony => colony.level >= DirectiveColonize.requiredRCL
							  && colony.name != Directive.getPos(flag).roomName && colony.spawns.length > 0);
		// Register incubation status
		this.toColonize = this.room ? Overmind.colonies[Overmind.colonyMap[this.room.name]] : undefined;
		// Remove if misplaced
		if (Cartographer.roomType(this.pos.roomName) != ROOMTYPE_CONTROLLER) {
			log.warning(`${this.print}: ${printRoomName(this.pos.roomName)} is not a controller room; ` +
						`removing directive!`);
			this.remove(true);
			return;
		}
	}

	spawnMoarOverlords() {
		this.overlords.claim = new ClaimingOverlord(this);
		this.overlords.pioneer = new PioneerOverlord(this);
		let sf = RoomIntel.getSafetyData(this.pos.roomName);
		if (sf.threatLevel > 0 && sf.invisibleFor > 300) {
			this.overlords.scout = new StationaryScoutOverlord(this);
		}
	}

	init() {
		this.alert(`Colonization in progress`);
	}

	run(verbose = false) {
		// TODO bug where can't claim a reservation room -> this.flag.pos.roomName == this.toColonize.name
		if (this.toColonize && this.toColonize.spawns.length > 0) {
			// Reassign all pioneers to be miners and workers
			const miningOverlords = _.map(this.toColonize.miningSites, site => site.overlords.mine);
			for (const pioneer of (<PioneerOverlord>this.overlords.pioneer).pioneers) {
				const miningOverlord = miningOverlords.shift();
				if (miningOverlord) {
					log.info(`Reassigning: ${pioneer.print} to mine: ${miningOverlord.print}`);
					pioneer.reassign(miningOverlord, Roles.drone);
				} else {
					log.info(`Reassigning: ${pioneer.print} to work: ${this.toColonize.overlords.work.print}`);
					pioneer.reassign(this.toColonize.overlords.work, Roles.worker);
				}
			}
			// Remove the directive
			this.remove();
		}
		if (Game.time % 10 == 2 && this.room && !!this.room.owner && this.room.owner != MY_USERNAME) {
			log.notify(`Removing Colonize directive in ${this.pos.roomName}: room already owned by another player.`);
			this.remove();
		}
	}
}
