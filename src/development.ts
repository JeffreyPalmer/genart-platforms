// development platform that doesn't require any content your index.html
// based off of the fxhash implementation, but with hash local hash generation
import { ResettableRandom } from '@jeffpalmer/genart-random'
import type { Seed } from './platform.js'
import { GenArtBatchable, GenArtPlatform, DefaultRng } from './platform.js'

const alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"

export type DevelopmentOptions = {
    hash?:string
    isPreview?:boolean
    width?:number
}

// Internal use only
export class Development implements GenArtPlatform, GenArtBatchable {
    private _hash: string
    private _seed: Seed
    private _isPreview:boolean
    private _width:number

    constructor(options:DevelopmentOptions = {}) {
        // Try to load a hash from the url
        let params = new URLSearchParams(location.search)

        const { hash, isPreview, width } = {
            // Try to load a hash from the URL, if available
            hash: params.get('hash') ?? Development.generateHash(),
            isPreview: true,
            // Default to the window width
            width: Math.min(window.devicePixelRatio ?? 1, 2) * window.innerWidth,
            ...options
        }

        console.log(options, isPreview)

        this._hash = hash
        this._seed = Development.generateSeed(hash)
        this._width = width
        this._isPreview = isPreview

        console.log(`Initializing development platform with hash: ${hash}`)
    }

    rng(): ResettableRandom {
        return new DefaultRng(this._seed)
    }

    hash(): string {
        return this._hash
    }


    seed(): Seed {
        return this._seed
    }

    isPreview(): boolean {
        return this._isPreview
    }

    triggerPreview(): void {
        console.log("Triggered development preview")
    }

    width() {
        return this._width
    }

    regenerateHashAndSeed() {
        this._hash = Development.generateHash()
        this._seed = Development.generateSeed(this._hash)
        console.log(`Generated a new hash: ${this._hash}`)
    }

    private static generateHash() {
        return "oo" + Array(49).fill(0).map(_ => alphabet[(Math.random() * alphabet.length) | 0]).join('')
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
