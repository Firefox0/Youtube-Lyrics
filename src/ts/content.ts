import * as UI from "./dom/ui";
import * as Yt from "./dom/ytDom";
import * as Storage from "./storage";
import * as LyricsModules from "./lyricsModules/lyricsModules";

let previousTitle: string = "";
let lyricsPosition: boolean = false;
let lyricsShowing: boolean = false;
let descriptionExpanded: boolean = false;

function filterTitle(title: string): string {
    title = title.toLowerCase();

    const forbiddenBracketedContent: { [key: string]: string} = {"[": "]", "(": ")"};
    const forbiddenCharacters: string[] = ["&", "|"];
    let foundKey: string | null = null;
    let firstIndex: number = 0;
    let prevTitleLength = 0;
    for (let i = 0; i < title.length; i++) {
   		let c = title[i];

        if (forbiddenCharacters.includes(c)) {
            title = title.slice(0, i) + title.slice(i + 1);
            i--;
            continue;
        }
        
    	if (foundKey !== null) {
            if (c === forbiddenBracketedContent[foundKey]) {
                prevTitleLength = title.length;
                title = title.slice(0, firstIndex) + title.slice(i + 1);
                i -= prevTitleLength - title.length;
                foundKey = null;
            }
            continue;
       }
       
       	for (const key of Object.keys(forbiddenBracketedContent)) {
            if (c === key) {
                foundKey = key;
                firstIndex = i;
                break;
            }
        }
      }

    title = title.split("ft.")[0]

    return encodeURI(title);
}

function getYoutubeTitle(): string | null {
    if (!window.location.href.includes("/watch?v=")){
        return null;
    }

    const youtubeTitle = document.title.replace(" - YouTube", "");
    if (previousTitle !== youtubeTitle) {
        previousTitle = youtubeTitle;
    }
    return youtubeTitle;
}

async function deepSearch(title: string): Promise<object | null> {
    const filteredTitle: string = filterTitle(title);
    const iterator = await LyricsModules.getLyricsIter(filteredTitle);
    for await (const value of iterator) {
        if (value !== null) {
            return value;
        }
    }
    return null;
}

function getChannelName(): string | null {
    const channelElement: Element = document.getElementsByClassName("yt-simple-endpoint style-scope yt-formatted-string")[2];
    if (channelElement === undefined) {
        return null;
    }
    return (channelElement as HTMLElement).innerText;
}

export async function titleHandler(): Promise<boolean> {
    if (document.title === "YouTube") {
        return false;
    }

    const youtubeTitle: string | null = getYoutubeTitle();
    if (youtubeTitle === null) {
        return false;
    }

    await updateLyrics(youtubeTitle);
    return true;
}

export async function updateLyrics(title: string): Promise<void> {
    UI.showLoading();

    if (title === "") {
        let tempTitle: string | null = getYoutubeTitle();
        if (tempTitle === null) {
            UI.displayError("Retrieving Title");
            return;
        }
        title = tempTitle;
    }

    let result: object | null = await deepSearch(title);
    if (result !== null) {
        handleLyricsSuccess(result);
        return;
    }

    const channelName: string | null = getChannelName();
    if (channelName === null) {
        handleLyricsError("Retrieving Channel Name");
        return;
    }

    const alternativeTitle = channelName + " " + title;
    result = await deepSearch(alternativeTitle);
    if (result !== null) {
        handleLyricsSuccess(result);
        return;
    }

    handleLyricsError("Sorry, I tried very hard but I couldn't find the lyrics.")
}

function handleLyricsError(message: string): void {
    UI.hideLoading();
    UI.displayError("Error: " + message);
}

function handleLyricsSuccess(result: object): void {
    UI.hideLoading();
    UI.updateDescription(result);
}

export function toggleDisplay() {
    lyricsShowing = !lyricsShowing;
    UI.toggleDisplay(lyricsShowing);
    Storage.setOpenState(lyricsShowing);
}

export function submit(value: string) {
    updateLyrics(value);
}

export function moveUI() {
    lyricsPosition = !lyricsPosition;
    UI.moveUI(lyricsPosition);
    Storage.setLyricsPosition(lyricsPosition);
    if (!lyricsPosition || descriptionExpanded) {
        return;
    }

    if (Yt.clickOnDescription()) {
        return;
    }

    descriptionExpanded = !descriptionExpanded;
}

export function descriptionClicked(value: boolean) {
    descriptionExpanded = value;
    if (descriptionExpanded) {
        UI.showUI();
        return;
    }

    if (!lyricsPosition) {
        return;
    }

    UI.hideUI();
} 

export async function init(): Promise<void> {
    new MutationObserver((records, observer) => {
        if (!window.location.href.includes("/watch?v=")) {
            return;
        }

        const description = document.querySelector(".style-scope.ytd-text-inline-expander");
        if (!description) {
            return;
        }

        const secondary = document.querySelector("div[id='secondary'][class='style-scope ytd-watch-flexy']");
        if (!secondary) {
            return;
        }

        observer.disconnect();
        Yt.descriptionObserver();
        UI.activeDarkMode(Yt.activeDarkMode());
        UI.createUI(description as HTMLElement, secondary as HTMLElement);
        lyricsPosition = Storage.lyricsInsideDescription() ?? false;
        lyricsShowing = Storage.getOpenState() ?? false;
        UI.useSettings(lyricsPosition, lyricsShowing);

        titleHandler();
        Yt.titleObserver();
        Yt.mixObserver();
    }).observe(document.body, {
        "childList": true
    });
}

(async () => {
    await init();
})();
