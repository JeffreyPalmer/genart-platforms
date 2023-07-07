// fx(hash) platform abstraction
import type { Seed } from './platform.js'
import { GenArtPlatform } from './platform.js'

// TODO: Upgrade to the new snippet API
// Pre-define functions that are provided by the fxhash snippet
declare var fxhash: string
declare var isFxpreview: boolean
declare var fxpreview: () => void

const alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"

// Internal use only
export class FxHash implements GenArtPlatform {
    private _hash: string
    private _seed: Seed

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

    regenerateHashAndSeed() {
        this._hash = "oo" + Array(49).fill(0).map(_ => alphabet[(Math.random() * alphabet.length) | 0]).join('')
        this._seed = FxHash.generateSeed(this._hash)
    }

    // From the fx(hash) snippet
    private static generateSeed(hash: string): Seed {
        let b58dec = (str: string) => [...str].reduce((p, c) => p * alphabet.length + alphabet.indexOf(c) | 0, 0)
        let fxhashTrunc = hash.slice(2)
        let regex = new RegExp(".{" + ((hash.length / 4) | 0) + "}", 'g')
        let hashes = fxhashTrunc.match(regex)!.map(h => b58dec(h))
        return [...hashes] as Seed
    }
}
