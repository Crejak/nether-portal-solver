import {DimensionTravelType, getDimensionTravelScale, round} from "./models.ts";

export interface IVector {
    x: number,
    y: number,
    z: number
}

export function nullVector(): IVector {
    return {
        x: 0,
        y: 0,
        z: 0
    };
}

export function oneVector(): IVector {
    return {
        x: 1,
        y: 1,
        z: 1
    };
}

export class Vector implements Readonly<IVector> {
    private readonly _x: number;
    private readonly _y: number;
    private readonly _z: number;

    private constructor(x: number, y: number, z: number) {
        this._x = x;
        this._y = y;
        this._z = z;
    }

    public static fromDef(def: Readonly<IVector>): Vector {
        return new Vector(def.x, def.y, def.z);
    }

    public static fromCoords(x: number, y: number, z: number): Vector {
        return new Vector(x, y, z);
    }

    public static apply(fn: (a: number, b: number) => number, a: Vector, b: Vector): Vector {
        return Vector.fromCoords(
            fn(a._x, b._x),
            fn(a._y, b._y),
            fn(a._z, b._z)
        );
    }

    public static squaredDistance(a: Vector, b: Vector): number {
        return ((a._x - b._x) * (a._x - b._x) + (a._y - b._y) * (a._y - b._y) + (a._z - b._z) * (a._z - b._z));
    }

    public static horizontalMaxDistance(a: Vector, b: Vector): number {
        return Math.max(Math.abs(a._x - b._x), Math.abs(a._z - b._z));
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get z(): number {
        return this._z;
    }

    public floored(): Vector {
        return Vector.fromCoords(
            Math.floor(this._x),
            Math.floor(this._y),
            Math.floor(this._z)
        );
    }

    public ceiled(): Vector {
        return Vector.fromCoords(
            Math.ceil(this._x),
            Math.ceil(this._y),
            Math.ceil(this._z)
        );
    }

    public isDiscrete(): boolean {
        return Number.isSafeInteger(this._x)
            && Number.isSafeInteger(this._y)
            && Number.isSafeInteger(this._z);
    }

    public hasVolume(): boolean {
        return Math.abs(this._x) > 0
            && Math.abs(this._y) > 0
            && Math.abs(this._z) > 0;
    }

    public scaled(dimensionTravelType: DimensionTravelType): Vector {
        const scale = getDimensionTravelScale(dimensionTravelType);
        return Vector.fromCoords(
            this._x * scale,
            this._y,
            this._z * scale
        );
    }

    public times(scale: number): Vector {
        return Vector.fromCoords(
            this._x * scale,
            this._y * scale,
            this._z * scale
        );
    }

    public minus(other: Vector): Vector {
        return Vector.fromCoords(
            this._x - other._x,
            this._y - other._y,
            this._z - other._z
        );
    }

    public plus(other: Vector): Vector {
        return Vector.fromCoords(
            this._x + other._x,
            this._y + other._y,
            this._z + other._z
        );
    }

    public toString(): string {
        return `(${round(this._x, 6)}; ${round(this._y, 6)}; ${round(this._z, 6)})`;
    }
}