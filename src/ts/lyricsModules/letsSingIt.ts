import { LyricsInterface } from "../interface/lyricsInterface";
import * as Misc from "../common/misc";

function getTitle(dom: Document): string | null {
    const elements = dom.title.split(" Lyrics");
    if (!elements.length) {
        return null;
    }
    return elements[0];
}

function parse(dom: Document): string | null {
    return dom.getElementById("lyrics")?.innerText ?? null;
}

async function getLink(query: string): Promise<string | null> {
    let url = "https://search.letssingit.com/?a=search&s=" + query;
    let dom: Document | null = await Misc.urlToDom(url);
    if (dom === null) {
        return null;
    }

    let href = dom.querySelector(".high_profile[href]");
    if (href === null) {
        return null;
    }

    let link = href.getAttribute("href");
    if (link === null) {
        return null;
    }

    return link;
}

export class LetsSingIt implements LyricsInterface {
    async getLyrics(query: string): Promise<object | null> {
        const url = await getLink(query);
        if (url === null) {
            return null;
        }

        const dom: Document | null = await Misc.urlToDom(url);
        if (dom === null) {
            return null;
        }
        
        const title: string | null = getTitle(dom);
        if (title === null) {
            return null;
        }

        let lyrics: string | null = parse(dom);
        if (lyrics === null) {
            return null;
        }

        if (lyrics.startsWith("Unfortunately we don't have the lyrics")) {
            return null;
        }

        return {"title": title, "url": url, "lyrics": lyrics};
    }
}
