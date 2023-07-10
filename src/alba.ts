// Alba platform abstraction
import type { Seed } from './platform.js';
import { GenArtBatchable, GenArtPlatform } from './platform.js';

type AlbaType = typeof window & {
    alba: {
        params: {
            seed: string;
            tokenId: number;
            width?: number;
        };
        isComplete: () => boolean;
        setComplete: (a: boolean) => void;
        getMetadata: () => Record<string, any>;
        setMetadata: (a: Record<string, any>) => void;
        prng: (seed: string) => () => number;
        _testSeed: () => string;
    };
};

// Generate an RNG seed from the hash string
function generateSeed(hash: string): Seed {
    const [_, seedHex] = hash.split("x")
    return [...Array(4).keys()].map((i) => parseInt(seedHex.slice(i * 8, (i + 1) * 8), 16)) as Seed
}

// TODO: Allow for overrides during construction?
// TODO: Should devicePixeRatio be used or should that be a param during construction?
// Pull out all non-essential code to help in minimization
export class Alba implements GenArtPlatform {
    private _hash: string
    private _seed: Seed
    private _alba: AlbaType["alba"]

    constructor() {
        const alba = (window as AlbaType).alba
        this._alba = alba
        this._hash = alba.params.seed
        this._seed = generateSeed(this._hash)
    }

    hash(): string {
        return this._hash
    }

    seed(): Seed {
        return this._seed
    }

    isPreview(): boolean {
        // Alba doesn't currently have a way to determine if this is a preview render, so always assume it is
        return true
    }

    triggerPreview(): void {
        this._alba.setComplete(true)
    }

    // TODO: Should the default width be settable instead of innerWidth?
    width() {
        return this._alba.params.width ?? window.innerWidth * (window.devicePixelRatio ?? 2)
    }
}


// Convenience class that will auto-generate hashes and provide support for batch rendering
// It will also try to pull a hash from the url, if provided, before generating a random one
export class AlbaDev implements GenArtPlatform, GenArtBatchable {
    private _hash: string
    private _seed: Seed
    private _alba: AlbaType["alba"]

    constructor() {
        const alba = (window as AlbaType).alba
        this._alba = alba
        let params = new URLSearchParams(location.search)
        this._hash = alba.params.seed ?? params.get('hash') ?? this._alba._testSeed()
        this._seed = generateSeed(this._hash)
        console.log("WARNING: Using Alba development version")
    }

    hash(): string {
        return this._hash
    }

    seed(): Seed {
        return this._seed
    }

    isPreview(): boolean {
        // Alba doesn't currently have a way to determine if this is a preview render, so always assume it is
        return true
    }

    triggerPreview(): void {
        this._alba.setComplete(true)
    }

    // TODO: Should the default width be settable?
    width() {
        return this._alba.params.width ?? window.innerWidth * (window.devicePixelRatio ?? 2)
    }

    regenerateHashAndSeed() {
        this._hash = this._alba._testSeed()
        this._seed = generateSeed(this._hash)
    }
}
