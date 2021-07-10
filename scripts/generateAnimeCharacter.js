var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { loadGraphModel } = require("@tensorflow/tfjs-converter");
const tf = require("@tensorflow/tfjs-node");
// Generates A new Anime character
export const MODEL_DATA = {
    LATENT_DIM: 64
};
export function generateNewAnimeCharacter() {
    return __awaiter(this, void 0, void 0, function* () {
        const MODEL_URL = `https://redblazerflame.github.io/my-projects-public-api/api/redblazerflames-project-portfolio/anime-character-generator/model${Math.floor(Math.random() * 27) + 1}/generator/model.json`;
        const model = yield loadGraphModel(MODEL_URL);
        const inputNoise = tf.randomNormal([1, MODEL_DATA.LATENT_DIM], 0, 1, "float32");
        const generatedImage = yield model.executeAsync(inputNoise);
        return generatedImage.dataSync().map(i => (i + 1) * 127.5);
    });
}
