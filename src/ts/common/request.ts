export async function userFetch(url: string): Promise<Response | null> {
    try {
        return await fetch(url, {
            headers: {
                "upgrade-insecure-requests": "1",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Windows; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36",
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "sec-ch-ua": "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-site": "none",
                "sec-fetch-mod": "",
                "sec-fetch-user": "?1",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "bg-BG,bg;q=0.9,en-US;q=0.8,en;q=0.7"
            }
        });
    } catch {
        return null;
    }
}

export async function text(url: string): Promise<string | null> {
    let response = await userFetch(url);
    if (response === null) {
        return null;
    }

    return await response.text();
}

export async function json(url: string): Promise<any | null> {
    let response = await userFetch(url);
    if (response === null) {
        return null;
    } 
    return response.json();
}
