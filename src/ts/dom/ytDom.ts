import * as YtLyrics from "../content/content";

let descriptionExpand: HTMLElement | null = null;

export function titleObserver(): void {
    new MutationObserver(async () => {
        YtLyrics.titleHandler();
    }).observe(document.documentElement.getElementsByTagName("title")[0], {
        "childList": true
    });
}

export function mixObserver(): void {
    let mixElement = document.querySelector("div[class='ytp-chapter-title-content']") as HTMLElement;
    if (mixElement === null) {
        return;
    }
    new MutationObserver(async () => {
        await YtLyrics.updateLyrics(mixElement.innerText);
    }).observe(mixElement, {
        "childList": true
    });
}

export function descriptionObserver() {
    descriptionExpand = document.querySelector("tp-yt-paper-button[id='expand']");
    if (descriptionExpand === null) {
        return;
    }

    new MutationObserver((records: any) => {
        if (records[0]["target"]["hidden"]) {
            YtLyrics.descriptionClicked(true);
        } else {
            YtLyrics.descriptionClicked(false);
        }
    }).observe(descriptionExpand, {
        "attributes": true,
        "attributeFilter": ["hidden"]
    });
}

export function activeDarkMode(): boolean {
    const htmlElement: HTMLElement = document.getElementsByTagName("html")[0];
    return htmlElement.hasAttribute("dark");
}

export function clickOnDescription(): boolean {
    if (descriptionExpand === null) {
        return false;
    }
    descriptionExpand.click();
    return true;
}
