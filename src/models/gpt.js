import Bytez from "bytez.js";
import { getKey } from "../utils/keys.js";

export const TTSConfig = null;

export class GPT {

    static prefix = "openai";

    constructor(model = "openai/gpt-5", url = null, params = {}) {

        const key = getKey("OPENAI_API_KEY");

        this.model = model;
        this.params = params;

        this.sdk = new Bytez(key);
    }

    async sendRequest(messages) {

        try {

            const model = this.sdk.model(this.model);

            const { error, output } = await model.run(messages);

            if (error) {
                console.error(error);
                return "My brain disconnected, try again.";
            }

            return output?.content || output?.text || "";

        } catch (err) {

            console.error("GPT request error:", err);
            return "My brain disconnected, try again.";

        }

    }

}
