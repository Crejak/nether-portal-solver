import {Portal, PortalHit} from "./Portal.ts";
import {Box} from "./Box.ts";
import {Vector} from "./Vector.ts";

export interface ISourceBlockPosHitInfo<Key> {
    sourceDestinationBlockPos: Vector;
    sourcePlayerEntryBox: Box;
    hits: Array<PortalHit<Key>>;
}

export function hitInfoToString(hitInfo: ISourceBlockPosHitInfo<any>): string {
    return `From ${hitInfo.sourcePlayerEntryBox} -> ${hitInfo.hits.length} portal(s) : ${hitInfo.hits.map(hit => hit.target.name)}`;
}

export class Analyzer<Key> {
    private readonly _sourceDestinationPosToHitInfo: Map<string, ISourceBlockPosHitInfo<Key>>;

    private constructor(sourceDestinationPosToHitInfo: Map<string, ISourceBlockPosHitInfo<Key>>) {
        this._sourceDestinationPosToHitInfo = sourceDestinationPosToHitInfo;
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

        return new Analyzer<Key>(hashMap);
    }

    public static empty<Key>() {
        return new Analyzer<Key>(new Map<string, ISourceBlockPosHitInfo<Key>>());
    }

    public hitInfos(): IterableIterator<ISourceBlockPosHitInfo<Key>> {
        return this._sourceDestinationPosToHitInfo.values();
    }
}