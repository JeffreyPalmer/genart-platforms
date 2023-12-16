import type {  } from '@thi.ng/random'
import type { ResettableRandom } from '@jeffpalmer/genart-random'
import { SFC32 } from '@thi.ng/random'

export type Seed = [number, number, number, number]

export interface GenArtPlatform {
    isPreview():boolean
    triggerPreview():void
    hash():string
    rng():ResettableRandom
    width():number
}

export interface GenArtBatchable {
    regenerateHashAndSeed():void
}

export class DefaultRng extends SFC32 implements ResettableRandom {
    constructor(readonly _seed:Seed) {
        super(_seed)
    }
    reset(): void {
        this.seed(this._seed)
    }
}

// Save the current hash to local storage for debugging/sanity purposes
export function saveHashToLocalStorage(hash:string) {
    const storedKeys = JSON.parse(window.localStorage.getItem('hashes') as string) ?? [];
    if (!storedKeys.includes(hash)) {
        storedKeys.length >= 10 && storedKeys.shift();
        storedKeys.push(hash);
        localStorage.setItem('hashes', JSON.stringify(storedKeys));
    }
    localStorage.setItem('prevHash', window.localStorage.getItem('hash') as string);
    localStorage.setItem('hash', hash);
}
