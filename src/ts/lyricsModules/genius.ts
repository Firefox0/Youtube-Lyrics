import { LyricsInterface } from "../interface/lyricsInterface";
import * as Messenger from "../messenger/messenger";
import * as DomParser from "../common/domParser";
import * as Misc from "../common/misc";

function getTitle(dom: Document): string | null {
    return dom.querySelector("meta[property='og:title']")?.getAttribute("content") ?? null;
}

function parse(dom: Document): string | null {
    const lyrics: string = dom.querySelector("p")?.innerText ?? "";
    // Genius is sometimes changing the HTML.
    // The lyrics needs to be scraped with a different algorithm.
    // Output of lyrics when the HTML changes is "Produced by" only.
    if (lyrics.length <= 15) {
        return null;
    }

    return lyrics;
}

function parseAlt(dom: Document): string {
    const classes: NodeListOf<HTMLElement> = dom.querySelectorAll("*");
    let lyrics: string = "";
    for (const element of classes) {
        try {
            if (element.className.includes("Lyrics__Container-sc-")) {
                // Convert <br> explicitly, otherwise it will just
                // get consumed later without adding a new line.
                lyrics += element.innerHTML.replaceAll("<br>", "\n");
            }
        }
        catch {
            continue;
        }
    }

    return DomParser.htmlToText(lyrics);
}

async function getLink(query: string): Promise<string | null> {
    const url = "https://genius.com/api/search/multi?per_page=5&q=" + query;

    let json: any = await Messenger.urlToJson(url);
    if (json === null) {
        return null;
    }

    const sections = json["response"]["sections"];
    for (const section of sections) {
        const hits = section["hits"];
        if (!section["hits"].length) {
            return null;
        }
        const firstHit = hits[0];
        if (firstHit["type"] === "song" && firstHit["index"] === "song") {
            return firstHit["result"]["url"];
        }
    }
    return null;
}

export class Genius implements LyricsInterface {
    async getLyrics(query: string): Promise<object | null> {
        const url: string | null = await getLink(query);
        if (url === null) {
            return null;
        }

        const dom: Document | null = await Misc.urlToDom(url);
        if (dom === null) {
            return null;
        }
        
        const title: string | null = getTitle(dom);
        if (title === null){
            return null;
        }
        
        let lyrics: string | null = parse(dom);
        if (lyrics !== null) {
            return {"title": title, "url": url, "lyrics": lyrics};
        }

        lyrics = parseAlt(dom);
        if (lyrics === "") {
            return {"title": title, "url": url, "lyrics": "Instrumental"}
        }

        if (lyrics !== null) {
            return {"title": title, "url": url, "lyrics": lyrics};
        }
    
        return null;

    }
}
