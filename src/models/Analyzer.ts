import {Portal, PortalHit} from "./Portal.ts";
import {Box} from "./Box.ts";
import {Vector} from "./Vector.ts";

export interface ISourceBlockPosHitInfo<Key> {
    sourceDestinationBlockPos: Vector;
    sourcePlayerEntryBox: Box;
    hits: Array<PortalHit<Key>>;
}

export function hitInfoToString(hitInfo: ISourceBlockPosHitInfo<any>): string {
    return `${hitInfo.sourcePlayerEntryBox} > ${hitInfo.hits.map(hit => `"${hit.target.name}"`).join("; ")} (${hitInfo.hits.length})`;
}

export class Analyzer<Key> {
    private readonly _sourceDestinationPosToHitInfo: Map<string, ISourceBlockPosHitInfo<Key>>;
    private readonly _allPortalResults: Array<Array<Key>>;

    private constructor(sourceDestinationPosToHitInfo: Map<string, ISourceBlockPosHitInfo<Key>>, allPortalResults: Array<Array<Key>>) {
        this._sourceDestinationPosToHitInfo = sourceDestinationPosToHitInfo;
        this._allPortalResults = allPortalResults;
    }

    public static analyze<Key>(portalMap: Map<Key, Portal>, sourceKey: Key): Analyzer<Key> {
        const source = portalMap.get(sourceKey);
        if (source === undefined) {
            throw new Error(`Key not found in portal map : ${sourceKey}`);
        }
        const portalHits = source.findClosestPortals(portalMap);
        const hashMap = new Map<string, ISourceBlockPosHitInfo<Key>>();

        for (const sourceDestinationBlockPos of source.destinationBlockPosList()) {
            hashMap.set(sourceDestinationBlockPos.hash(), {
                sourceDestinationBlockPos: sourceDestinationBlockPos,
                sourcePlayerEntryBox: source.invertDestinationBlockPos(sourceDestinationBlockPos),
                hits: []
            });
        }

        for (const hit of portalHits) {
            hashMap
                .get(hit.sourceClosestDestinationBlockPos.hash())
                ?.hits
                ?.push(hit);
        }

        let resultHashSet: Set<string> = new Set<string>();
        for (const hitInfo of hashMap.values()) {
            const hitKeys = hitInfo.hits.map(hit => hit.targetKey);
            resultHashSet.add(hashKeyArray(hitKeys));
        }
        let allPortalResults: Array<Array<Key>> = [];
        resultHashSet.forEach(hash => allPortalResults.push(unhashKeyArray(hash)));

        return new Analyzer<Key>(hashMap, allPortalResults);
    }

    public static empty<Key>() {
        return new Analyzer<Key>(new Map<string, ISourceBlockPosHitInfo<Key>>());
    }

    public hitInfos(): IterableIterator<ISourceBlockPosHitInfo<Key>> {
        return this._sourceDestinationPosToHitInfo.values();
    }

    public get allPortalResults(): Array<Array<Key>> {
        return this._allPortalResults;
    }
}

function hashKeyArray<Key>(keyArray: Array<Key>): string {
    return JSON.stringify(keyArray.sort());
}

function unhashKeyArray<Key>(hash: string): Array<Key> {
    return JSON.parse(hash);
}