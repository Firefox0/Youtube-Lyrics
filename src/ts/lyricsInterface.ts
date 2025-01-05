export interface LyricsInterface {
    readonly getLyrics: (query: string) => Promise<object | null>;
}
