import Bytez from "bytez.js"
import { getKey } from "../utils/keys.js"

export const TTSConfig = null

export class GPT {

static prefix = "openai"

constructor(model="openai/gpt-4.1-nano"){

const key = getKey("OPENAI_API_KEY")

this.sdk = new Bytez(key,{
baseURL:"https://api.bytez.com/v1"
})

this.model = model

}

async sendRequest(messages){

try{

const model = this.sdk.model(this.model)

let res

try{

res = await model.run(messages)

}catch(e){

console.log("Bytez request failed:",e)

return "My brain disconnected, try again."

}

if(!res || typeof res !== "object"){
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
