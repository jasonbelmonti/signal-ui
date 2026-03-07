export type PixelCubePathAnimationProfile = {
    cycleMs: number;
    delaysMs: number[];
};
type CreatePixelCubePathAnimationProfileOptions = {
    count: number;
    cycleMs: number;
    seed: number;
};
export declare function createPixelCubePathAnimationProfile({ count, cycleMs, seed, }: CreatePixelCubePathAnimationProfileOptions): PixelCubePathAnimationProfile;
export declare function getPixelCubePathAnimationSeed(value: string): number;
export {};
