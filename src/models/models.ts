export enum DimensionTravelType {
    OVERWORLD_TO_NETHER,
    NETHER_TO_OVERWORLD
}

export function getDimensionTravelScale(dimensionTravelType: DimensionTravelType): number {
    switch (dimensionTravelType) {
        case DimensionTravelType.NETHER_TO_OVERWORLD:
            return 8;
        case DimensionTravelType.OVERWORLD_TO_NETHER:
            return 1/8;
    }
}

export function scaleVector(vector: IVector, dimensionTravelType: DimensionTravelType): IVector {
    const scale = getDimensionTravelScale(dimensionTravelType);
    console.assert(scale !== undefined);
    return {
        x: vector.x * scale,
        y: vector.y,
        z: vector.z * scale
    };
}

export interface IVector {
    x: number,
    y: number,
    z: number
}

export function vector(x: number, y: number, z: number): IVector {
    return {
        x,
        y,
        z
    };
}

export function floorVector(vector: IVector): IVector {
    return {
        x: Math.floor(vector.x),
        y: Math.floor(vector.y),
        z: Math.floor(vector.z)
    };
}

export function isDiscrete(vector: IVector): boolean {
    return Number.isSafeInteger(vector.x)
        && Number.isSafeInteger(vector.y)
        && Number.isSafeInteger(vector.z);
}

export function noNullCoordinate(vector: IVector): boolean {
    return vector.x > 0
        && vector.y > 0
        && vector.z > 0;
}

export function squaredDistance(a: IVector, b: IVector): number {
    return ((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) + (a.z - b.z) * (a.z - b.z));
}

export interface IBox {
    corner: IVector,
    extend: IVector
}

export class Box {
    private _corner: IVector;
    private _extend: IVector;
    private _highestCorner: IVector;

    private constructor(corner: IVector, extend: IVector) {
        this._corner = corner;
        this._extend = extend;
        this._highestCorner = corner;
        this.reduce();
    }

    public static fromIBox(def: IBox) {
        return new Box(def.corner, def.extend);
    }

    public static fromCorners(cornerA: IVector, cornerB: IVector) {
        return new Box(cornerA, {
            x: cornerB.x - cornerA.x,
            y: cornerB.y - cornerA.y,
            z: cornerB.z - cornerA.z,
        });
    }

    private reduce() {
        let minCorner: IVector = {
            x: Math.min(this._corner.x, this._corner.x + this._extend.x),
            y: Math.min(this._corner.y, this._corner.y + this._extend.y),
            z: Math.min(this._corner.z, this._corner.z + this._extend.z),
        };
        let maxCorner: IVector = {
            x: Math.max(this._corner.x, this._corner.x + this._extend.x),
            y: Math.max(this._corner.y, this._corner.y + this._extend.y),
            z: Math.max(this._corner.z, this._corner.z + this._extend.z),
        };
        this._corner = minCorner;
        this._highestCorner = maxCorner;
        this._extend = {
            x: Math.abs(this._highestCorner.x - this._corner.x),
            y: Math.abs(this._highestCorner.y - this._corner.y),
            z: Math.abs(this._highestCorner.z - this._corner.z),
        }
    }

    public scaled(dimensionTravelType: DimensionTravelType): Box {
        return Box.fromIBox({
            corner: scaleVector(this._corner, dimensionTravelType),
            extend: scaleVector(this._extend, dimensionTravelType)
        });
    }

    public lowestCorner(): IVector {
        return this._corner;
    }

    public highestCorner(): IVector {
        return this._highestCorner;
    }

    public isBlockBox(): boolean {
        return isDiscrete(this._corner)
            && isDiscrete(this._extend)
            && noNullCoordinate(this._extend);
    }

    public blockPosArray(): Array<IVector> {
        const lowestFloored = floorVector(this.lowestCorner());
        const highest = this.highestCorner();

        let result: Array<IVector> = [];
        for (let x = lowestFloored.x; x < highest.x; x += 1) {
            for (let y = lowestFloored.y; y < highest.y; y += 1) {
                for (let z = lowestFloored.z; z < highest.z; z += 1) {
                    result.push(vector(x, y, z));
                }
            }
        }
        return result;
    }
}