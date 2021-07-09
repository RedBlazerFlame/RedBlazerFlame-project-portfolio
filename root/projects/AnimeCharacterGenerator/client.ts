import { redirect } from "/root/text-redirect.js";

// Declaring Constants and Variables
const STATE: {[key: string]: any} = {};
const generateImageButton: HTMLButtonElement = document.querySelector("button.generate-character-button");
const redirectableElements: Array<HTMLElement> = [
    ...document.querySelectorAll('div[data-can-redirect="true"]'),
] as Array<HTMLElement>;

// Declaring Functions
function drawNewImageOnCanvas(ctx: CanvasRenderingContext2D, imageData: Array<number>, width = 64, height = 64, dWidth = 5, dHeight = 5) {
    let currentIndex = 0;

    for(let y = 0; y < height; y ++) {
        for(let x = 0; x < width; x ++) {
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
redirectableElements.forEach((redirectableElement: HTMLElement): void => {
    redirectableElement.addEventListener("click", () => {
        redirect(
            redirectableElement.dataset.redirectUrl,
            redirectableElement.dataset.redirectTarget
        );
    });
});

// Declaring an async wrapper so that we could use await
(async function main() {
    // Setting up Canvas
    const canvas: HTMLCanvasElement = document.getElementById("image-canvas") as HTMLCanvasElement;
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    
    // Creating generate image button click event Listener
    STATE.generateImageButton = "free";
    generateImageButton.addEventListener("click", async(ev) => {
        generateImageButton.blur();

        if (STATE.generateImageButton == "free") {
            STATE.generateImageButton = "busy";

            generateImageButton.innerText = "Generating... Please Wait";

            let imageData: Array<number> = Object.values(await fetch("/api/animeFaceGenerator").then(res => res.json())) as Array<number>;

            drawNewImageOnCanvas(ctx, imageData);

            generateImageButton.innerText = "Generate Another Character";
            STATE.generateImageButton = "free";
        } else {
            console.log("Clicked when busy");
            generateImageButton.innerText = "Image is still generating. Please wait.";
        }
    });

    generateImageButton.innerText = "Generate New Anime Character";
})();
