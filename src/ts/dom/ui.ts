import * as YtLyrics from "../content";

let controls: HTMLElement = document.createElement("div");
let toggleButton: HTMLElement;
let input: HTMLInputElement = document.createElement("input");
let searchButton: HTMLElement;
let moveButton: HTMLElement;

let content: HTMLDivElement = document.createElement("div");
let loaderContainer: HTMLElement = document.createElement("div");
let loader: HTMLElement = document.createElement("div");
let source: HTMLAnchorElement = document.createElement("a");
let lyricsText: HTMLElement = document.createElement("p");

let mainContainer: HTMLDivElement = document.createElement("div");
let descriptionContainer: HTMLDivElement = document.createElement("div");
let scrollBox: HTMLDivElement = document.createElement("div");

export function submit(): void {
    YtLyrics.submit(input.value);
}

function createYoutubeButton(callback: () => void) {
    let button = document.createElement("button");
    button.classList.add("lyricsButton");
    button.setAttribute("type", "button");
    button.innerText = "";
    button.onclick = callback;
    return button;
}

export function createUI(description: HTMLElement, scrollBoxContainer: HTMLElement): void {
    initializeButtons();
    initializeInput();
    setStyles();
    prepareScrollBox(scrollBoxContainer);
    arrangeElements(description);
    setIDs();
}

function initializeButtons(): void {
    toggleButton = createYoutubeButton(YtLyrics.toggleDisplay);
    searchButton = createYoutubeButton(submit);
    moveButton = createYoutubeButton(YtLyrics.moveUI);
}

function arrangeElements(description: HTMLElement): void {
    appendElements(mainContainer, [toggleButton, controls, content]);
    appendElements(controls, [
        input, searchButton, moveButton
    ]);
    loaderContainer.appendChild(loader);
    appendElements(content, [
        loaderContainer, source, lyricsText
    ]);

    description.insertAdjacentElement("afterend", descriptionContainer);
}

function setIDs(): void {
    controls.setAttribute("id", "controls");
    toggleButton.setAttribute("id", "toggleButton");
    input.setAttribute("id", "lyricsInput");
    searchButton.setAttribute("id", "searchButton");

    content.setAttribute("id", "lyricsContent");
    loaderContainer.setAttribute("id", "loaderContainer");
    loader.setAttribute("id", "loader");
    source.setAttribute("id", "source");
    lyricsText.setAttribute("id", "lyricsText");

    mainContainer.setAttribute("id", "lyricsContainer");
    scrollBox.setAttribute("id", "scrollBox");
}

function setStyles() {
    toggleButton.classList.add("material-symbols-outlined");
    searchButton.classList.add("material-symbols-outlined");
    moveButton.classList.add("material-symbols-outlined");

    toggleButton.innerText = "expand_more";
    searchButton.innerText = "search";
}

export function useSettings(lyricsPosition: boolean, openState: boolean): void {
    if (lyricsPosition) {
        moveButton.innerText = "move_up";
        descriptionContainer.appendChild(mainContainer);
    } else {
        moveButton.innerText = "move_down";
        scrollBox.appendChild(mainContainer);
        scrollBox.style.display = "block";
        showUI();
    }

    toggleDisplay(openState);
}

export function activeDarkMode(value: boolean): void {
    lyricsText.style.color = value ? "white" : "black";
}

function initializeInput(): void {
    setAttributes(input, {
        "type": "input",
        "placeholder": "Search"
    });
    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            YtLyrics.submit(input.value);
        }
    });
}

function deletePreviousLyrics(): void {
    setSource("", "");
    lyricsText.innerText = "";
}

export function toggleDisplay(openState: boolean | null): void {
    if (openState) {
        toggleButton.innerText = "expand_less";
        controls.style.display = "flex";
        content.style.display = "block";
    } else {
        toggleButton.innerText = "expand_more";
        controls.style.display = "none";
        content.style.display = "none";
    }
}

export function moveUI(lyricsPosition: boolean): void {
    let destination: HTMLElement;

    if (lyricsPosition) {
        destination = descriptionContainer;
        scrollBox.style.display = "none";
        destination.scrollIntoView({
            "behavior": "smooth"
        });
        moveButton.innerText = "move_up";
    } else {
        destination = scrollBox;
        scrollBox.style.display = "block";
        destination.scrollIntoView({
            "behavior": "smooth",
            "block": "end"
        });
        moveButton.innerText = "move_down";
    }

    destination.appendChild(mainContainer);
}

export async function updateDescription(data: any): Promise<void> {
    if (!data) {
        return;
    }

    const url: string = data["url"];
    setSource(data["title"] + "\n\n", url);
    lyricsText.innerText = data["lyrics"];
}

function appendElements(base: HTMLElement, elements: HTMLElement[]): void {
    for (const i in elements) {
        base.appendChild(elements[i]);
    }
}

function setAttributes(element: HTMLInputElement, attributesObj: { [key: string]: any }) {
    for (const key in attributesObj) {
        element.setAttribute(key, attributesObj[key]);
    }
}

function setSource(text: string, url: string): void {
    source.innerText = text;
    source.href = url;
}

export function showUI(): void {
    mainContainer.style.display = "block";
}

export function hideUI(): void {
    mainContainer.style.display = "none";
}

export function showLoading(): void {
    deletePreviousLyrics();
    loaderContainer.style.display = "block";
}

export function hideLoading(): void {
    loaderContainer.style.display = "none";
}

function prepareScrollBox(scrollBoxContainer: HTMLElement): void {
    if (scrollBoxContainer === null) {
        return;
    }

    scrollBoxContainer.insertBefore(scrollBox, scrollBoxContainer.firstChild);
}

export function displayError(text: string) {
    setSource("Contact", "https://github.com/Firefox0/Youtube-Lyrics");
    lyricsText.innerText = text;
}
