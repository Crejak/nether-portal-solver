import {DimensionTravelType} from "./models.ts";
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

    public findClosestPortals(others: Array<Portal>): Array<Portal> {
        const destinationLocations = this.destinationBlockPosList();

        let resultMap = new Map<string, Portal>();

        for (let destinationLocation of destinationLocations) {
            let minPortalDistance = Infinity;
            let closestPortal: Portal = others[0];
            for (let other of others) {
                const otherDistance = other._blockBox.blockPosArray()
                    .map(otherBlock => Vector.squaredDistance(destinationLocation, otherBlock))
                    .sort((a, b) => a - b)
                    [0];
                if (otherDistance < minPortalDistance) {
                    minPortalDistance = otherDistance;
                    closestPortal = other;
                }
            }
            console.assert(closestPortal !== undefined);
            resultMap.set(closestPortal._name, closestPortal);
        }

        return Array.from(resultMap.values());
    }
}