import Bytez from "bytez.js"
import { getKey } from "../utils/keys.js"

export const TTSConfig = null

export class GPT {

static prefix = "openai"

constructor(model="openai/gpt-4.1-nano"){

const key = getKey("OPENAI_API_KEY")

this.sdk = new Bytez(key)
this.model = model

}

async sendRequest(messages){

try{

const model = this.sdk.model(this.model)

let res

try{
res = await model.run(messages)
}catch(e){
console.log("Bytez network error:", e)
return "My brain disconnected, try again."
}

// FIX 1: tránh crash nếu Bytez trả undefined
if(!res || typeof res !== "object"){
console.log("Bytez returned invalid response:", res)
return "My brain disconnected, try again."
}

const { error, output } = res

// FIX 2: Bytez API error
if(error){
console.log("Bytez error:", error)
return "My brain disconnected, try again."
}

// FIX 3: output null
if(!output){
return "My brain disconnected, try again."
}

// FIX 4: output string
if(typeof output === "string"){

// tránh HTML lỗi <!DOCTYPE
if(output.trim().startsWith("<!DOCTYPE")){
console.log("Bytez returned HTML instead of JSON")
return "My brain disconnected, try again."
}

return output
}

// FIX 5: output.content dạng string
if(typeof output.content === "string"){
return output.content
}

// FIX 6: output.content dạng array (OpenAI format)
if(Array.isArray(output.content)){
return output.content.map(p=>p.text || "").join("")
}

// FIX 7: output.text
if(output.text){
return output.text
}

// fallback nếu format lạ
return JSON.stringify(output)

}catch(err){

console.log("GPT request error:", err)
return "My brain disconnected, try again."

}

}

}
