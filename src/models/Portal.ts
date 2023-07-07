import {DimensionTravelType, getDimensionTravelPortalSearchRadius} from "./models.ts";
import {Box, IBox} from "./Box.ts";
import {Vector} from "./Vector.ts";

export interface IPortal {
    name: string;
    dimensionTravelType: DimensionTravelType;
    blockBox: IBox;
    obstructNorth: boolean;
    obstructEast: boolean;
    obstructSouth: boolean;
    obstructWest: boolean;
}

export class Portal implements Readonly<IPortal> {
    private readonly _name: string;
    private readonly _dimensionTravelType: DimensionTravelType;
    private readonly _blockBox: Box;
    private readonly _playerEntryBox: Box;
    private readonly _obstructNorth: boolean;
    private readonly _obstructEast: boolean;
    private readonly _obstructSouth: boolean;
    private readonly _obstructWest: boolean;

    private constructor(def: Readonly<IPortal>) {
        this._name = def.name;
        this._dimensionTravelType = def.dimensionTravelType;
        this._blockBox = Box.fromDef(def.blockBox);

        const lowest = this._blockBox.lowestCorner;
        const highest = this._blockBox.highestCorner;

        this._obstructNorth = def.obstructNorth;
        this._obstructEast = def.obstructEast;
        this._obstructSouth = def.obstructSouth;
        this._obstructWest = def.obstructWest;

        this._playerEntryBox = Box.fromCorners({
            x: lowest.x + (def.obstructWest ? 0.3 : -0.3),
            y: lowest.y,
            z: lowest.z + (def.obstructNorth ? 0.3 : -0.3)
        }, {
            x: highest.x + (def.obstructEast ? -0.3 : 0.3),
            y: highest.y,
            z: highest.z + (def.obstructSouth ? -0.3 : 0.3)
        });
    }

    public static fromDef(def: Readonly<IPortal>) {
        return new Portal(def);
    }

    public get name() {
        return this._name;
    }


    public get dimensionTravelType(): DimensionTravelType {
        return this._dimensionTravelType;
    }

    public get blockBox(): Box {
        return this._blockBox;
    }

    public get playerEntryBox(): Box {
        return this._playerEntryBox;
    }

    public get obstructNorth(): boolean {
        return this._obstructNorth;
    }

    public get obstructEast(): boolean {
        return this._obstructEast;
    }

    public get obstructSouth(): boolean {
        return this._obstructSouth;
    }

    public get obstructWest(): boolean {
        return this._obstructWest;
    }

    public blockPosList(): Array<Vector> {
        return this._blockBox.blockPosArray();
    }

    public destinationBox(): Box {
        return this._playerEntryBox.scaled(this._dimensionTravelType);
    }

    public destinationBlockBox(): Box {
        return this.destinationBox().asBlockBox();
    }

    public destinationBlockPosList(): Array<Vector> {
        return this.destinationBox().blockPosArray();
    }

    public idealPortalLocation(): Vector {
        return this.destinationBox().center().floored();
    }

    public findClosestPortals<Key>(portalMap: Map<Key, Portal>): Array<PortalHit<Key>> {
        const destinationLocations = this.destinationBlockPosList();

        let result: Array<PortalHit<Key>> = [];

        for (let destinationLocation of destinationLocations) {
            let potentialPortalHits: Array<IPortalHit<Key>> = [];
            for (let otherPortalKey of portalMap.keys()) {
                const otherPortal = portalMap.get(otherPortalKey);
                if (otherPortal === undefined || otherPortal.dimensionTravelType === this.dimensionTravelType) {
                    continue;
                }
                const otherHit: IPortalBlockHit | undefined = otherPortal
                    .blockPosList()
                    .filter(otherBlock => Vector.horizontalMaxDistance(destinationLocation, otherBlock) <= getDimensionTravelPortalSearchRadius(this._dimensionTravelType))
                    .map(otherBlock => {
                        return {
                            squaredDistance: Vector.squaredDistance(destinationLocation, otherBlock),
                            targetClosestBlockPos: otherBlock
                        }
                    })
                    .sort(compareHits)
                    .find(_ => true); //if multiple closest blocks, doesn't matter because it's the same portal
                if (otherHit !== undefined) {
                    potentialPortalHits.push({
                        ...otherHit,
                        source: this,
                        targetKey: otherPortalKey,
                        target: otherPortal,
                        sourceClosestDestinationBlockPos: destinationLocation,
                    });
                }
            }
            if (potentialPortalHits.length > 0) {
                const sortedPortalHits = potentialPortalHits.sort(compareHits);
                const closest = potentialPortalHits[0];
                sortedPortalHits
                    .filter(hit => compareHits(closest, hit) === 0)
                    .forEach(closestHit => {
                        result.push(PortalHit.fromDef(closestHit));
                    });
            }
        }

        return result;
    }
}

export interface IPortalBlockHit {
    targetClosestBlockPos: Vector;
    squaredDistance: number;
}

function compareHits(a: IPortalBlockHit, b: IPortalBlockHit): number {
    const diff = a.squaredDistance - b.squaredDistance;
    if (diff !== 0) {
        return diff;
    }
    return a.targetClosestBlockPos.y - b.targetClosestBlockPos.y
}

export interface IPortalHit<Key> extends IPortalBlockHit {
    source: Portal;
    targetKey: Key;
    target: Portal;
    sourceClosestDestinationBlockPos: Vector;
}

export class PortalHit<Key> implements Readonly<IPortalHit<Key>> {
    private readonly _source: Portal;
    private readonly _targetKey: Key;
    private readonly _target: Portal;
    private readonly _sourceClosestDestinationBlockPos: Vector;
    private readonly _targetClosestBlockPos: Vector;
    private readonly _squaredDistance: number;

    private constructor(def: Readonly<IPortalHit<Key>>) {
        this._source = def.source;
        this._targetKey = def.targetKey;
        this._target = def.target;
        this._sourceClosestDestinationBlockPos = def.sourceClosestDestinationBlockPos;
        this._targetClosestBlockPos = def.targetClosestBlockPos;
        this._squaredDistance = def.squaredDistance;
    }

    public static fromDef<Key>(def: Readonly<IPortalHit<Key>>): PortalHit<Key> {
        return new PortalHit(def);
    }

    public get source(): Portal {
        return this._source;
    }

    public get targetKey(): Key {
        return this._targetKey;
    }

    public get target(): Portal {
        return this._target;
    }

    public get sourceClosestDestinationBlockPos(): Vector {
        return this._sourceClosestDestinationBlockPos;
    }

    public get targetClosestBlockPos(): Vector {
        return this._targetClosestBlockPos;
    }

    public get squaredDistance(): number {
        return this._squaredDistance;
    }

    public toString(): string {
        return `From [${this.source.name}] to [${this.target.name}]@${this.targetKey} via ${this.sourceClosestDestinationBlockPos} -> ${this.targetClosestBlockPos} (dist: ${this.squaredDistance})`
    }
}