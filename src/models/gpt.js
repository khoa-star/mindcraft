import OpenAI from "openai";
import { getKey } from "../utils/keys.js";

export const TTSConfig = {
    provider: "openai",
    model: "gpt-4o-mini-tts",
    voice: "alloy"
};

export class GPT {

    static prefix = "openai";

    constructor(model = "gpt-4.1-nano", url = null, params = {}) {

        const key = getKey("OPENAI_API_KEY");

        this.model = model || "gpt-4.1-nano";
        this.params = params || {};

        this.openai = new OpenAI({
            apiKey: key,

            // Bytez endpoint
            baseURL: "https://api.bytez.com/v1"
        });

    }

    async sendRequest(messages) {

        try {

            const completion = await this.openai.chat.completions.create({

                model: this.model,
                messages: messages,
                temperature: this.params.temperature ?? 0.7,
                max_tokens: this.params.max_tokens ?? 512

            });

            return completion.choices?.[0]?.message?.content || "";

        } catch (err) {

            console.error("GPT request error:", err);

            return "My brain disconnected, try again.";

        }

    }

}
