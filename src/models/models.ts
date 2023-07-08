export enum DimensionTravelType {
    OVERWORLD_TO_NETHER,
    NETHER_TO_OVERWORLD
}

export function opposite(dimensionTravelType: DimensionTravelType): DimensionTravelType {
    switch (dimensionTravelType) {
        case DimensionTravelType.NETHER_TO_OVERWORLD:
            return DimensionTravelType.OVERWORLD_TO_NETHER;
        case DimensionTravelType.OVERWORLD_TO_NETHER:
            return DimensionTravelType.NETHER_TO_OVERWORLD;
    }
}

export function getDimensionTravelScale(dimensionTravelType: DimensionTravelType): number {
    switch (dimensionTravelType) {
        case DimensionTravelType.NETHER_TO_OVERWORLD:
            return 8;
        case DimensionTravelType.OVERWORLD_TO_NETHER:
            return 1 / 8;
    }
}

export function getDimensionTravelPortalSearchRadius(dimensionTravelType: DimensionTravelType): number {
    switch (dimensionTravelType) {
        case DimensionTravelType.NETHER_TO_OVERWORLD:
            return 128;
        case DimensionTravelType.OVERWORLD_TO_NETHER:
            return 16;
    }
}

export function round(n: number, decimal: number): number {
    const fac = Math.pow(10, decimal);
    return Math.round((n + Number.EPSILON) * fac) / fac;
}
