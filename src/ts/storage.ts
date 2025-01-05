const positionKey = "lyricsPosition";
const openKey = "lyricsShowing";

export function lyricsInsideDescription(): boolean | null {
    let value = localStorage.getItem(positionKey);
    if (value === null) {
        return null;
    }

    return stringToBoolean(value);
}

export function setLyricsPosition(value: boolean): void {
    localStorage.setItem(positionKey, booleanToString(value));
}

export function getOpenState(): boolean | null {
    let value = localStorage.getItem(openKey);
    if (value === null) {
        return null;
    }

    return stringToBoolean(value);
}

export function setOpenState(value: boolean): void {
    localStorage.setItem(openKey, booleanToString(value));
}

function stringToBoolean(str: string): boolean | null {
    switch (str) {
        case "0": {
            return false;
        }
        case "1": {
            return true;
        }
        default: {
            return null;
        }
    }
} 

function booleanToString(bool: boolean): string {
    return bool ? "1" : "0";
}
