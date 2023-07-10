export type Seed = [number, number, number, number]

export interface GenArtPlatform {
    isPreview():boolean
    triggerPreview():void
    hash():string
    seed():Seed
    width():number
}

export interface GenArtBatchable {
    regenerateHashAndSeed():void
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
