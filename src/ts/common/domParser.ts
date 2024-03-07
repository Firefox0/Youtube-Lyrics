const domParser = new DOMParser();

export async function htmlToDom(html: string): Promise<Document | null> {
    return domParser.parseFromString(html, "text/html");
}

export function htmlToText(html: string): string {
    return domParser.parseFromString(html, "text/html").body.innerText;
}
