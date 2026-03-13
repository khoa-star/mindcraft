import { getKey } from "../utils/keys.js"

export const TTSConfig = null

export class GPT {

static prefix = "openai"

constructor(model="openai/gpt-4.1-nano"){

this.model = model
this.key = getKey("OPENAI_API_KEY")

}

async sendRequest(messages){

try{

const res = await fetch("https://api.bytez.com/v1/chat/completions",{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":`Bearer ${this.key}`
},
body:JSON.stringify({
model:this.model,
messages:messages
})
})

if(!res.ok){

console.log("Bytez HTTP error:",res.status)
return "My brain disconnected, try again."

}

const data = await res.json()

if(!data || !data.choices){
return "My brain disconnected, try again."
}

return data.choices[0].message.content

}catch(err){

console.log("GPT request error:",err)
return "My brain disconnected, try again."

}

}

}
