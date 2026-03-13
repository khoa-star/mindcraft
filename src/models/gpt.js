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

// tránh crash khi Bytez trả undefined
if(!res || typeof res !== "object"){
console.log("Bytez returned invalid response")
return "My brain disconnected, try again."
}

const { error, output } = res

if(error){
console.log("Bytez error:", error)
return "My brain disconnected, try again."
}

if(!output){
return "My brain disconnected, try again."
}

if(typeof output === "string"){
return output
}

if(output.content){
return output.content
}

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
