export enum DimensionTravelType {
    OVERWORLD_TO_NETHER,
    NETHER_TO_OVERWORLD
}

export function getDimensionTravelScale(dimensionTravelType: DimensionTravelType): number {
    switch (dimensionTravelType) {
        case DimensionTravelType.NETHER_TO_OVERWORLD:
            return 8;
        case DimensionTravelType.OVERWORLD_TO_NETHER:
            return 1 / 8;
    }
}

export function round(n: number, decimal: number): number {
    const fac = Math.pow(10, decimal);
    return Math.round((n + Number.EPSILON) * fac) / fac;
}
