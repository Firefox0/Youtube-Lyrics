import { browserAPI } from "../common/global";

export async function urlToJson(url: string): Promise<any | null> {
    let response: any = await browserAPI.runtime.sendMessage({"action": "json", "arg": url});
    return response["response"];
}

export async function urlToResponse(url: string): Promise<string | null> {
    let response: any = await browserAPI.runtime.sendMessage({"action": "response", "arg": url});
    return response["response"];
}
