import Bytez from "bytez.js"
import { getKey } from "../utils/keys.js"

export const TTSConfig = null

export class GPT {

    static prefix = "openai"

    constructor(model = "openai/gpt-4.1-nano", url = null, params = {}) {

        const key = getKey("OPENAI_API_KEY")

        this.model = model
        this.params = params

        this.sdk = new Bytez(key)

    }

    async sendRequest(messages) {

        try {

            const model = this.sdk.model(this.model)

            const res = await model.run(messages)

            if (!res) {

                console.error("Bytez returned empty response")

                return "My brain disconnected, try again."

            }

            if (res.error) {

                console.error("Bytez API error:", res.error)

                return "My brain disconnected, try again."

            }

            const output = res.output

            if (!output) {

                return "My brain disconnected, try again."

            }

            if (typeof output === "string") {

                return output

            }

            if (output.content) {

                return output.content

            }

            if (output.text) {

                return output.text

            }

            return JSON.stringify(output)

        }

        catch (err) {

            console.error("GPT request error:", err)

            return "My brain disconnected, try again."

        }

    }

}
