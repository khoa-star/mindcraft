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

// retry 2 lần nếu API lỗi
for(let i=0;i<2;i++){

try{

res = await model.run(messages)

if(res) break

}catch(e){

console.log("Bytez network error:",e)

}

}

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

// fallback nếu format lạ
return JSON.stringify(res.output)

}catch(err){

console.log("GPT request error:",err)

return "My brain disconnected, try again."

}

}

}
