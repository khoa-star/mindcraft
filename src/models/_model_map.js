import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamically discover model classes in this directory.
// Each model class must export a static `prefix` string.
const apiMap = await (async () => {

    const map = {};

    const files = (await fs.readdir(__dirname))
        .filter(f => f.endsWith('.js') && f !== '_model_map.js' && f !== 'prompter.js');

    for (const file of files) {

        try {

            const moduleUrl = pathToFileURL(path.join(__dirname, file)).href;

            const mod = await import(moduleUrl);

            for (const exported of Object.values(mod)) {

                if (typeof exported === 'function' &&
                    Object.prototype.hasOwnProperty.call(exported, 'prefix')) {

                    const prefix = exported.prefix;

                    if (typeof prefix === 'string' && prefix.length > 0) {

                        map[prefix] = exported;

                    }

                }

            }

        }

        catch (e) {

            console.warn('Failed to load model module:', file, e?.message || e);

        }

    }

    return map;

})();


export function selectAPI(profile) {

    if (typeof profile === 'string' || profile instanceof String) {

        profile = {model: profile};

    }

    // backwards compatibility with local->ollama
    if (profile.api?.includes('local') || profile.model?.includes('local')) {

        profile.api = 'ollama';

        if (profile.model) {

            profile.model = profile.model.replace('local', 'ollama');

        }

    }

    if (!profile.api) {

        const api = Object.keys(apiMap).find(key => profile.model?.startsWith(key));

        if (api) {

            profile.api = api;

        }

        else {

            const model = profile.model?.toLowerCase() || "";

            // ===== OpenAI =====
            if (model.includes('gpt') || model.includes('o1') || model.includes('o3'))
                profile.api = 'openai';

            // ===== Anthropic =====
            else if (model.includes('claude'))
                profile.api = 'anthropic';

            // ===== Google =====
            else if (model.includes('gemini'))
                profile.api = 'google';

            // ===== xAI =====
            else if (model.includes('grok'))
                profile.api = 'xai';

            // ===== Mistral =====
            else if (model.includes('mistral'))
                profile.api = 'mistral';

            // ===== Deepseek =====
            else if (model.includes('deepseek'))
                profile.api = 'deepseek';

            // ===== Qwen =====
            else if (model.includes('qwen'))
                profile.api = 'qwen';

            // ===== Meta Llama =====
            else if (model.includes('llama'))
                profile.api = 'meta';

            // ===== Cohere =====
            else if (model.includes('command'))
                profile.api = 'cohere';

            // ===== Microsoft Phi =====
            else if (model.includes('phi'))
                profile.api = 'microsoft';

            // ===== Google Gemma =====
            else if (model.includes('gemma'))
                profile.api = 'google';

            // ===== Yi =====
            else if (model.includes('yi'))
                profile.api = 'yi';

            // ===== Solar =====
            else if (model.includes('solar'))
                profile.api = 'upstage';

        }

        if (!profile.api) {

            throw new Error('Unknown model: ' + profile.model);

        }

    }

    if (!apiMap[profile.api]) {

        throw new Error('Unknown api: ' + profile.api);

    }

    let model_name = profile.model.replace(profile.api + '/', '');

    profile.model = model_name === "" ? null : model_name;

    return profile;

}


export function createModel(profile) {

    if (!!apiMap[profile.model]) {

        // if the model value is an api (instead of a specific model name)
        // then set model to null so it uses the default model for that api

        profile.model = null;

    }

    if (!apiMap[profile.api]) {

        throw new Error('Unknown api: ' + profile.api);

    }

    const model = new apiMap[profile.api](profile.model, profile.url, profile.params);

    return model;

}
