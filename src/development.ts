// development platform that doesn't require any content your index.html
// based off of the fxhash implementation, but with hash local hash generation
import type { Seed } from './platform.js'
import { GenArtPlatform } from './platform.js'

const alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"

// Internal use only
export class Development implements GenArtPlatform {
    private _hash: string
    private _seed: Seed
    private _pixelRatio: number

    constructor() {
        // Try to load a hash from the url
        let params = new URLSearchParams(location.search)
        const hash = params.get('hash') ?? Development.generateHash()
        this._hash = hash
        this._seed = Development.generateSeed(hash)
        this._pixelRatio = window.devicePixelRatio ?? 2
        console.log(`Initializing development platform with hash: ${hash}`)
    }

    hash(): string {
        return this._hash
    }

    seed(): Seed {
        return this._seed
    }

    isPreview(): boolean {
        return true
    }

    triggerPreview(): void {
        console.log("Triggered development preview")
    }

    generateHash() {
        this._hash = Development.generateHash()
        this._seed = Development.generateSeed(this._hash)
        console.log(`Generated a new hash: ${this._hash}`)
    }

    width() {
        // Default to the window width
        return window.innerWidth * this._pixelRatio
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