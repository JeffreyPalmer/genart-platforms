// fx(hash) platform abstraction
import type { Seed } from './platform.js'
import { GenArtBatchable, GenArtPlatform, } from './platform.js'

// TODO: Upgrade to the new snippet API
// Pre-define functions that are provided by the fxhash snippet
declare var fxhash: string
declare var isFxpreview: boolean
declare var fxpreview: () => void

const alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"

// TODO: Allow overrides during construction?
// TODO: Should devicePixeRatio be used or should that be a param during construction?
export class FxHash implements GenArtPlatform {
    protected _hash: string
    protected _seed: Seed

    constructor() {
        this._hash = fxhash
        this._seed = FxHash.generateSeed(this._hash)
    }

    hash(): string {
        return this._hash
    }

    seed(): Seed {
        return this._seed
    }

    isPreview(): boolean {
        return isFxpreview
    }

    triggerPreview(): void {
        fxpreview()
    }

    width() {
        // FxHash doesn't have the notion of a requested width
        // Default to the window width
        return window.innerWidth * (window.devicePixelRatio ?? 2)
    }

    // From the fx(hash) snippet
    // TODO: Is it possible to call this from the new snippet instead of replicating this code?
    protected static generateSeed(hash: string): Seed {
        let b58dec = (str: string) => [...str].reduce((p, c) => p * alphabet.length + alphabet.indexOf(c) | 0, 0)
        let fxhashTrunc = hash.slice(2)
        let regex = new RegExp(".{" + ((hash.length / 4) | 0) + "}", 'g')
        let hashes = fxhashTrunc.match(regex)!.map(h => b58dec(h))
        return [...hashes] as Seed
    }
}


// Add an extra method to support batched rendering
export class FxHashDev extends FxHash implements GenArtBatchable {
    constructor() {
        super()
        console.log("WARNING: Using FxHash development version")
    }

    regenerateHashAndSeed() {
        this._hash = "oo" + Array(49).fill(0).map(_ => alphabet[(Math.random() * alphabet.length) | 0]).join('')
        this._seed = FxHash.generateSeed(this._hash)
    }
}
