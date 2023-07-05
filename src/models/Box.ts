import {DimensionTravelType} from "./models.ts";
import {IVector, nullVector, oneVector, Vector} from "./Vector.ts";

export interface IBox {
    corner: IVector,
    extend: IVector
}

export function oneBlockBox(): IBox {
    return {
        corner: nullVector(),
        extend: oneVector()
    };
}

export class Box implements Readonly<IBox> {
    private _corner: Vector;
    private _extend: Vector;
    private _highestCorner: Vector;

    private constructor(corner: Vector, extend: Vector) {
        this._corner = corner;
        this._extend = extend;
        this._highestCorner = corner;
        this._reduce();
    }

    public static fromDef(def: Readonly<IBox>) {
        return new Box(Vector.fromDef(def.corner), Vector.fromDef(def.extend));
    }

    public static fromExtend(corner: Readonly<IVector>, extend: Readonly<IVector>) {
        return new Box(Vector.fromDef(corner), Vector.fromDef(extend));
    }

    public static fromCorners(cornerA: Readonly<IVector>, cornerB: Readonly<IVector>) {
        const corner = Vector.fromDef(cornerA);
        const extend = Vector.fromDef(cornerB).minus(corner)
        return new Box(corner, extend);
    }

    private _reduce() {
        const minCorner = Vector.apply(Math.min, this._corner, this._corner.plus(this._extend));
        const maxCorner = Vector.apply(Math.max, this._corner, this._corner.plus(this._extend));
        this._corner = minCorner;
        this._highestCorner = maxCorner;
        this._extend = this._highestCorner.minus(this._corner);
    }

    public get corner(): Vector {
        return this._corner;
    }

    public get extend(): Vector {
        return this._extend;
    }

    public get lowestCorner(): Vector {
        return this._corner;
    }

    public get highestCorner(): Vector {
        return this._highestCorner;
    }

    public scaled(dimensionTravelType: DimensionTravelType): Box {
        return Box.fromExtend(
            this._corner.scaled(dimensionTravelType),
            this._extend.scaled(dimensionTravelType)
        );
    }

    public isBlockBox(): boolean {
        return this._corner.isDiscrete()
            && this._extend.isDiscrete()
            && this._extend.hasVolume();
    }

    public asBlockBox(): Box {
        return Box.fromCorners(
            this.lowestCorner.floored(),
            this.highestCorner.ceiled()
        );
    }

    public blockPosArray(): Array<Vector> {
        const lowestFloored = this.lowestCorner.floored();
        const highest = this.highestCorner;

        let result: Array<Vector> = [];
        for (let x = lowestFloored.x; x < highest.x; x += 1) {
            for (let y = lowestFloored.y; y < highest.y; y += 1) {
                for (let z = lowestFloored.z; z < highest.z; z += 1) {
                    result.push(Vector.fromCoords(x, y, z));
                }
            }
        }
        return result;
    }

    public center(): Vector {
        return this._corner.plus(this._highestCorner).times(0.5);
    }

    public toString(): string {
        return `{${this._corner.toString()}, ${this._extend.toString()}, ${this._highestCorner.toString()}}`;
    }
}