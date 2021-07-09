import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { loadGraphModel } = require("@tensorflow/tfjs-converter");
const tf = require("@tensorflow/tfjs");


// Generates A new Anime character
export const MODEL_DATA = {
    LATENT_DIM: 64
};

let modelCache: Map<string, any> = new Map([]);

export async function generateNewAnimeCharacter() {
    const MODEL_URL: string = `https://redblazerflame.github.io/my-projects-public-api/api/redblazerflames-project-portfolio/anime-character-generator/model${Math.floor(Math.random() * 4) + 1}/generator/model.json`;

    let model: any;
    if(modelCache.has(MODEL_URL)) {
        model = modelCache.get(MODEL_URL);
    } else {
        model = await loadGraphModel(MODEL_URL);
    }
    
    const inputNoise = tf.randomNormal([1, MODEL_DATA.LATENT_DIM], 0, 1, "float32");

    const generatedImage = await model.executeAsync(inputNoise);

    return generatedImage.dataSync().map(i => (i + 1) * 127.5);
}