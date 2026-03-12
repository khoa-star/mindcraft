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

const res = await model.run(messages)

if(!res){
console.log("Bytez returned empty response")
return "My brain disconnected, try again."
}

if(res.error){
console.log("Bytez error:",res.error)
return "My brain disconnected, try again."
}

if(!res.output){
return "My brain disconnected, try again."
}

if(typeof res.output === "string"){
return res.output
}

if(res.output.content){
return res.output.content
}

if(res.output.text){
return res.output.text
}

return JSON.stringify(res.output)

}catch(err){

console.log("GPT request error:",err)

return "My brain disconnected, try again."

}

}

}
