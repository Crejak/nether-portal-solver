import {Box, DimensionTravelType, IBox, IVector, squaredDistance} from "./models.ts";

export interface IPortal {
    name: string;
    dimensionTravelType: DimensionTravelType;
    blockBox: IBox;
    obstructNorth: boolean;
    obstructEast: boolean;
    obstructSouth: boolean;
    obstructWest: boolean;
}

export class Portal {
    private readonly _name: string;
    private readonly _dimensionTravelType: DimensionTravelType;
    private readonly _blockBox: Box;
    private readonly _playerEntryBox: Box;

    public constructor(def: IPortal) {
        this._name = def.name;
        this._dimensionTravelType = def.dimensionTravelType;
        this._blockBox = Box.fromIBox(def.blockBox);

        const lowest = this._blockBox.lowestCorner();
        const highest = this._blockBox.highestCorner();

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

    public playerEntryBox(): Box {
        return this._playerEntryBox;
    }

    public blockPosList(): Array<IVector> {
        return this._blockBox.blockPosArray();
    }

    public destinationBlockPosList(): Array<IVector> {
        return this._playerEntryBox.scaled(this._dimensionTravelType).blockPosArray();
    }

    public findClosestPortals(others: Array<Portal>): Array<Portal> {
        const destinationLocations = this.destinationBlockPosList();
        
        let resultMap = new Map<string, Portal>();
        
        for (let destinationLocation of destinationLocations) {
            let minPortalDistance = Infinity;
            let closestPortal: Portal = others[0];
            for (let other of others) {
                const otherDistance = other._blockBox.blockPosArray()
                    .map(otherBlock => squaredDistance(destinationLocation, otherBlock))
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