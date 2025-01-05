import { browserAPI } from "./common/global";
import * as Request from "./common/request";

browserAPI.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
    switch (message["action"]) {
        case "json": {
            (async () => {
                let result = await Request.json(message["arg"]);
                sendResponse({"response": result});
            })();
            return true;
        }

        case "response": {
            (async () => {
                let result = await Request.text(message["arg"]);
                sendResponse({"response": result});
            })();
            return true;
        }
    }
    
    sendResponse({"response": "Unknown Action"})
});
