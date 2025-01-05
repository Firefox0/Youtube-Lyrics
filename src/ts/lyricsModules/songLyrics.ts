import { LyricsInterface } from "../lyricsInterface";
import * as Misc from "../common/misc";

function getTitle(dom: Document): string | null {
    let elements: NodeListOf<HTMLElement> = dom.querySelectorAll("span[itemprop='name']");
    if (!elements.length) {
        return null;
    }
    return elements[elements.length - 1].innerText;
}

function parse(dom: Document): string | null {
    return dom.getElementById("songLyricsDiv")?.innerText ?? null;
}

async function getLink(query: string): Promise<string | null> {
    let url = "https://www.songlyrics.com/index.php?section=search&searchW=" + query + "&submit=Search"
    let dom = await Misc.urlToDom(url);
    if (dom === null) {
        return null;
    }
    
    let href = dom.querySelector("h3 a[href]");
    if (href === null) {
        return null;
    }

    let link = href.getAttribute("href");
    if (link === null) {
        return null;
    }

    return link;
}

export class SongLyrics implements LyricsInterface {
    async getLyrics(query: string): Promise<object | null> {
        let url = await getLink(query);
        if (url === null) {
            return null;
        }

        let dom: Document | null = await Misc.urlToDom(url);
        if (dom === null) {
            return null;
        }

        let title = getTitle(dom);
        if (title === null) {
            return null;
        }

        let lyrics = parse(dom);
        if (lyrics === null) {
            return null;
        }

        return {"title": title, "url": url, "lyrics": lyrics};
    }
}
