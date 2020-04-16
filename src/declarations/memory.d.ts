type operationMode = 'manual' | 'semiautomatic' | 'automatic';

/**
 * TODO make this an enum
 * 0: Basic
 * 1: Collect from enemy storage/terminal
 * 2: Collect from all sources TBD
 * 3: Collect all and mine walls for energy TBD
 */
type resourceCollectionMode = number;

interface RawMemory {
	_parsed: any;
}

interface Memory {
	assimilator: any;
	Overmind: {};
	profiler: any;
	overseer: any;
	segmenter: any;
	strategist?: any;
	roomIntel: any;
	colonies: { [name: string]: any };
	creeps: { [name: string]: CreepMemory; };
	flags: { [name: string]: FlagMemory; };
	rooms: { [name: string]: RoomMemory; };
	spawns: { [name: string]: SpawnMemory; };
	pathing: PathingMemory;
	settings: {
		signature: string;
		operationMode: operationMode;
		log: LoggerMemory;
		enableVisuals: boolean;
		allies: string[];
		resourceCollectionMode: resourceCollectionMode;
		powerCollection: {
			enabled: boolean;
			maxRange: number;
			minPower: number;
		};
		autoPoison: {
			enabled: boolean;
			maxRange: number;
			maxConcurrent: number;
		},
	};
	stats: any;
	constructionSites: { [id: string]: number };
	// suspend?: number;
	resetBucket?: boolean;
	haltTick?: number;
	combatPlanner: any;
	playerCreepTracker: { // TODO revisit for a better longterm solution
		[playerName: string]: CreepTracker
	};
	zoneRooms: { [roomName: string]: { [type: string]: number } };
	reinforcementLearning?: {
		enabled?: boolean;
		verbosity?: number;
		workerIndex?: number;
	};

	screepsProfiler?: any;

	[otherProperty: string]: any;
}

interface StatsMemory {
	cpu: {
		getUsed: number;
		limit: number;
		bucket: number;
		usage: {
			[colonyName: string]: {
				init: number;
				run: number;
				visuals: number;
			}
		}
	};
	gcl: {
		progress: number;
		progressTotal: number;
		level: number;
	};
	colonies: {
		[colonyName: string]: {
			hatchery: {
				uptime: number;
			}
			miningSite: {
				usage: number;
				downtime: number;
			}
			storage: {
				energy: number;
			}
			rcl: {
				level: number,
				progress: number,
				progressTotal: number,
			}
		}
	};
}

interface PublicSegment {

}

interface CreepMemory {
	[MEM.OVERLORD]: string | null;
	[MEM.COLONY]: string | null;
	role: string;
	task: ProtoTask | null;
	needBoosts?: ResourceConstant[];
	data: {
		origin: string;
	};
	avoidDanger?: {
		start: number;
		timer: number;
		fallback: string;
	};
	noNotifications?: boolean;
	_go?: MoveData;
	debug?: boolean;
	talkative?: boolean;
}

interface MoveData {
	state: any[];
	path: string;
	roomVisibility: { [roomName: string]: boolean };
	delay?: number;
	fleeWait?: number;
	destination?: ProtoPos;
	priority?: number;
	waypoints?: string[];
	waypointsVisited?: string[];
	portaling?: boolean;
}

interface LoggerMemory {
	level: number;
	showSource: boolean;
	showTick: boolean;
}


interface CachedPath {
	path: RoomPosition[];
	length: number;
	tick: number;
}

interface PathingMemory {
	paths: { [originName: string]: { [destinationName: string]: CachedPath; } };
	distances: { [pos1Name: string]: { [pos2Name: string]: number; } };
	weightedDistances: { [pos1Name: string]: { [pos2Name: string]: number; } };
}

interface CreepTracker {
	creeps: { [name: string]: number }; 	// first tick seen
	types: { [type: string]: number }; 		// amount seen
	parts: { [bodyPart: string]: number }; 	// quantity
	boosts: { [boostType: string]: number };	// how many boosts are spent
}

interface FlagMemory {
	[MEM.TICK]?: number;
	[MEM.EXPIRATION]?: number;
	[MEM.COLONY]?: string;
	[MEM.DISTANCE]?: {
		[MEM_DISTANCE.UNWEIGHTED]: number;
		[MEM_DISTANCE.WEIGHTED]: number;
		[MEM.EXPIRATION]: number;
		incomplete?: boolean;
	};
	debug?: boolean;
	amount?: number;
	persistent?: boolean;
	setPos?: ProtoPos;
	rotation?: number;
	parent?: string;
	maxPathLength?: number;
	pathNotRequired?: boolean;
	maxLinearRange?: number;
	keepStorageStructures?: boolean;
	keepRoads?: boolean;
	keepContainers?: boolean;
	waypoints?: string[];
	allowPortals?: boolean;
	recalcColonyOnTick?: number;
}

// Room memory key aliases to minimize memory size

declare const enum MEM {
	TICK       = 'T',
	EXPIRATION = 'X',
	COLONY     = 'C',
	OVERLORD   = 'O',
	DISTANCE   = 'D',
	STATS      = 'S',
}

declare const enum MEM_DISTANCE {
	UNWEIGHTED = 'u',
	WEIGHTED   = 'w',
}

declare const enum RMEM {
	AVOID                = 'a',
	SOURCES              = 's',
	CONTROLLER           = 'c',
	MINERAL              = 'm',
	SKLAIRS              = 'k',
	EXPANSION_DATA       = 'e',
	INVASION_DATA        = 'v',
	HARVEST              = 'h',
	CASUALTIES           = 'd',
	SAFETY               = 'f',
	PREV_POSITIONS       = 'p',
	CREEPS_IN_ROOM       = 'cr',
	IMPORTANT_STRUCTURES = 'i',
	PORTALS              = 'pr',
	ROOM_STATUS          = 'rs',
	CREEP_INFO           = 'ci',
}

declare const enum RMEM_STRUCTS {
	TOWERS   = 't',
	SPAWNS   = 'sp',
	STORAGE  = 's',
	TERMINAL = 'e',
	WALLS    = 'w',
	RAMPARTS = 'r',
}

declare const enum RMEM_INVASION {
	HARVESTED = 'h',
	LAST_SEEN = 'l',
}

declare const enum RMEM_CTRL {
	LEVEL              = 'l',
	OWNER              = 'o',
	RESERVATION        = 'r',
	RES_USERNAME       = 'u',
	RES_TICKSTOEND     = 't',
	SAFEMODE           = 's',
	SAFEMODE_AVAILABLE = 'sa',
	SAFEMODE_COOLDOWN  = 'sc',
	PROGRESS           = 'p',
	PROGRESS_TOTAL     = 'pt',
}

declare const enum RMEM_MNRL {
	MINERALTYPE = 't',
	DENSITY     = 'd',
}

declare const enum MEM_AVGS {
	AMOUNT  = 'a',
	AVG1K   = 'k',
	AVG10K  = 'D',
	AVG100K = 'H',
	AVG1M   = 'M',
}

declare const enum RMEM_ROOM_STATUS {
	normal  = 'nm',
	closed  = 'cl',
	novice  = 'nv',
	respawn = 're'
}

type RoomStatusCompressed = [RMEM_ROOM_STATUS, number];

interface RollingStats {
	[MEM_AVGS.AMOUNT]: number;
	[MEM_AVGS.AVG10K]: number;
	[MEM_AVGS.AVG100K]: number;
	[MEM_AVGS.AVG1M]: number;
	[MEM.TICK]: number;
}

interface ExpansionData {
	score: number;
	bunkerAnchor: string;
	outposts: { [roomName: string]: number };
}

interface RoomMemory {
	spawnGroup?: any;
	[MEM.EXPIRATION]?: number;
	[MEM.TICK]?: number;
	[RMEM.AVOID]?: boolean | false;
	[RMEM.ROOM_STATUS]?: RoomStatusCompressed;
	[RMEM.SOURCES]?: SavedSource[];
	[RMEM.CONTROLLER]?: SavedController;
	[RMEM.PORTALS]?: SavedPortal[];
	[RMEM.MINERAL]?: SavedMineral;
	[RMEM.SKLAIRS]?: SavedRoomObject[];
	[RMEM.IMPORTANT_STRUCTURES]?: {
		// Positions of important structures relevant to sieges
		[RMEM_STRUCTS.TOWERS]: string[];
		[RMEM_STRUCTS.SPAWNS]: string[];
		[RMEM_STRUCTS.STORAGE]: string | undefined;
		[RMEM_STRUCTS.TERMINAL]: string | undefined;
		[RMEM_STRUCTS.WALLS]: string[];
		[RMEM_STRUCTS.RAMPARTS]: string[];
	};
	[RMEM.EXPANSION_DATA]?: ExpansionData | false;
	[RMEM.INVASION_DATA]?: {
		[RMEM_INVASION.HARVESTED]: number;
		[RMEM_INVASION.LAST_SEEN]: number;
	};
	// [RMEM.HARVEST]?: RollingStats;
	// [RMEM.CASUALTIES]?: {
	// 	cost: RollingStats
	// };
	[RMEM.SAFETY]?: SavedSafetyData; // TODO: deprecate
	[RMEM.PREV_POSITIONS]?: { [creepID: string]: ProtoPos }; // TODO: deprecate
	[RMEM.CREEPS_IN_ROOM]?: { [tick: number]: string[] }; // TODO: deprecate
	[RMEM.CREEP_INFOS]?: SavedCreepInfo;
}

interface SavedRoomObject {
	c: string; 	// coordinate name
}

interface SavedSource extends SavedRoomObject {
	cn?: string;
}

interface SavedPortal extends SavedRoomObject {
	dest: string | { shard: string, room: string }; // destination pos name or intershard destination
	[MEM.EXPIRATION]: number; // when portal will decay - set to Game.time + 1 million for undefined decay
}

interface SavedController extends SavedRoomObject {
	[RMEM_CTRL.LEVEL]: number | undefined;
	[RMEM_CTRL.OWNER]: string | undefined;
	[RMEM_CTRL.RESERVATION]: {
		[RMEM_CTRL.RES_USERNAME]: string,
		[RMEM_CTRL.RES_TICKSTOEND]: number,
	} | undefined;
	[RMEM_CTRL.SAFEMODE]: number | undefined;
	[RMEM_CTRL.SAFEMODE_AVAILABLE]: number;
	[RMEM_CTRL.SAFEMODE_COOLDOWN]: number | undefined;
	[RMEM_CTRL.PROGRESS]: number | undefined;
	[RMEM_CTRL.PROGRESS_TOTAL]: number | undefined;
}

interface SavedMineral extends SavedRoomObject {
	[RMEM_MNRL.MINERALTYPE]: MineralConstant;
	[RMEM_MNRL.DENSITY]: number;
}

declare const enum RMEM_SAFETY {
	THREAT_LEVEL         = 't',
	SAFE_FOR             = 's',
	UNSAFE_FOR           = 'u',
	INVISIBLE_FOR         = 'v',
	// SAFETY_1K            = 'k',
	// SAFETY_10K           = 'D',
	COMBAT_POTENTIALS    = 'c',
	NUM_HOSTILES         = 'nh',
	NUM_BOOSTED_HOSTILES = 'nb',
}

declare const enum COMBAT_POTENTIALS {
	ATTACK    = 'a',
	RANGED    = 'r',
	HEAL      = 'h',
	DISMANTLE = 'd',
}

interface SavedCombatPotentials {
	[COMBAT_POTENTIALS.ATTACK]: number;
	[COMBAT_POTENTIALS.RANGED]: number;
	[COMBAT_POTENTIALS.HEAL]: number;
	[COMBAT_POTENTIALS.DISMANTLE]?: number;
}

declare const enum RMEM_CREEP_INFO {
	ID          = 'id',
	COORD       = 'c',
	X_AVG       = 'xa',
	Y_AVG       = 'ya',
	TTL         = 'ttl',
	ENERGY_COST = 'e',
}

interface SavedCreepInfo {
	[RMEM_CREEP_INFO.ID]: string;
	[RMEM_CREEP_INFO.COORD]: string;
	[RMEM_CREEP_INFO.X_AVG]: number;
	[RMEM_CREEP_INFO.Y_AVG]: number;
	[RMEM_CREEP_INFO.TTL]: number;
	[RMEM_CREEP_INFO.ENERGY_COST]: number;
}

interface SavedSafetyData {
	[RMEM_SAFETY.THREAT_LEVEL]: number;
	[RMEM_SAFETY.SAFE_FOR]: number;
	[RMEM_SAFETY.UNSAFE_FOR]: number;
	[RMEM_SAFETY.INVISIBLE_FOR]: number;
	// [RMEM_SAFETY.SAFETY_1K]: number;
	// [RMEM_SAFETY.SAFETY_10K]: number;
	[RMEM_SAFETY.COMBAT_POTENTIALS]?: SavedCombatPotentials;
	[RMEM_SAFETY.NUM_HOSTILES]?: number;
	[RMEM_SAFETY.NUM_BOOSTED_HOSTILES]?: number;
}
interface SafetyData {
	threatLevel: number;
	safeFor: number;
	unsafeFor: number;
	invisibleFor: number;
	// [RMEM_SAFETY.SAFETY_1K]: number;
	// [RMEM_SAFETY.SAFETY_10K]: number;
	combatPotentials?: SavedCombatPotentials;
	numHostiles?: number;
	numBoostedHostiles?: number;
}





