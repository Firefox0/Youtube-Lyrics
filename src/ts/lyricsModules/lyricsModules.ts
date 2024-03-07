import { Genius } from "../lyricsModules/genius";
import { LetsSingIt } from "../lyricsModules/letsSingIt";
import { SongLyrics } from "../lyricsModules/songLyrics";

const lyricsModules: any[] = [Genius, LetsSingIt, SongLyrics];

export async function* getLyricsIter(query: string) {
    for (const lyricsModule of lyricsModules) {
        yield await lyricsModule.prototype.getLyrics(query);
    }
}
