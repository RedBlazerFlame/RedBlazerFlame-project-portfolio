var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { redirect } from "/root/text-redirect.js";
// Declaring Constants and Variables
const STATE = {};
const generateImageButton = document.querySelector("button.generate-character-button");
const redirectableElements = [
    ...document.querySelectorAll('div[data-can-redirect="true"]'),
];
// Declaring Functions
function drawNewImageOnCanvas(ctx, imageData, width = 64, height = 64, dWidth = 5, dHeight = 5) {
    let currentIndex = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            ctx.fillStyle = `rgb(${imageData[currentIndex + 2]},${imageData[currentIndex + 1]},${imageData[currentIndex]})`;
            ctx.beginPath();
            ctx.fillRect(x * dWidth, y * dHeight, dWidth, dHeight);
            ctx.closePath();
            ctx.fill();
            currentIndex += 3;
        }
    }
}
// Adding Event Listeners to All redirectableElements
redirectableElements.forEach((redirectableElement) => {
    redirectableElement.addEventListener("click", () => {
        redirect(redirectableElement.dataset.redirectUrl, redirectableElement.dataset.redirectTarget);
    });
});
// Declaring an async wrapper so that we could use await
(function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Setting up Canvas
        const canvas = document.getElementById("image-canvas");
        const ctx = canvas.getContext("2d");
        // Creating generate image button click event Listener
        STATE.generateImageButton = "free";
        generateImageButton.addEventListener("click", (ev) => __awaiter(this, void 0, void 0, function* () {
            generateImageButton.blur();
            if (STATE.generateImageButton == "free") {
                STATE.generateImageButton = "busy";
                generateImageButton.innerText = "Generating... Please Wait";
                let imageData = Object.values(yield fetch("/api/animeFaceGenerator").then(res => res.json()));
                drawNewImageOnCanvas(ctx, imageData);
                generateImageButton.innerText = "Generate Another Character";
                STATE.generateImageButton = "free";
            }
            else {
                console.log("Clicked when busy");
                generateImageButton.innerText = "Image is still generating. Please wait.";
            }
        }));
        generateImageButton.innerText = "Generate New Anime Character";
    });
})();
