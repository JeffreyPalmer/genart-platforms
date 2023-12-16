// fx(hash) platform abstraction
import type { FxHashApi } from '@fxhash/project-sdk'
import { GenArtPlatform, } from './platform.js'
import { ARandom } from '@thi.ng/random';
import type { ResettableRandom } from '@jeffpalmer/genart-random'
declare global {
    interface Window {
        $fx: FxHashApi;
    }
}

class FxHashRng extends ARandom implements ResettableRandom {
    rng: FxHashApi["rand"]
    constructor() {
        super()
        this.rng = window.$fx.rand
    }

    int(): number {
        return (this.rng() * 0x1_0000_0000) /* 2**32 */ >>> 0;
    }

    float(range = 1) {
        return this.rng() * range
    }

    norm(range = 1) {
        return (this.rng() - 0.5) * 2 * range
    }

    reset(): void {
        this.rng.reset!()
    }
}


export class FxHash implements GenArtPlatform {
    protected _hash: string

    constructor() {
        this._hash = window.$fx.hash
    }

    rng() {
        return new FxHashRng()
    }

    hash(): string {
        return this._hash
    }

    isPreview(): boolean {
        return window.$fx.isPreview
    }

    triggerPreview(): void {
        window.$fx.preview()
    }

    width() {
        // FxHash doesn't have the notion of a requested width
        // Default to the window width
        return Math.min(window.devicePixelRatio ?? 1, 2) * window.innerWidth
    }
}
