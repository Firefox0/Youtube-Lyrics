import * as Messenger from "../messenger";
import * as DomParser from "./domParser";

export async function urlToDom(url: string): Promise<Document | null> {
    const text: string | null = await Messenger.urlToResponse(url);
    if (text === null) {
        return null;
    }

    return DomParser.htmlToDom(text);
}
