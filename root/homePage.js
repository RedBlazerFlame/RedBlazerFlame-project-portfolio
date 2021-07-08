// Importing Libraries
import { redirect } from "./text-redirect.js";
// Declaring Constants and Variables
const topBannerSVGFrames = [...document.querySelectorAll("main.window > main.top-banner > div.icon > svg")];
const states = {};
const redirectableElements = [...document.querySelectorAll("div[data-can-redirect=\"true\"]")];
// Declaring Functions
// Heartwarming Console Logs ❤
console.log("%c🌈 Welcome to the Home Page!", "background-color: black; color: white; padding: 10px; border-radius: 5px; font-size: 10px; font-family: 'Arial'; font-weight: bold;");
// Redirect User to the top
/*document.documentElement.scrollTop = 0;
states.topRedirectInterval = 0
let topRedirectInterval = setInterval(() => {
    document.documentElement.scrollTop = 0;
    states.topRedirectInterval ++;
    if(states.topRedirectInterval > 200) {
        clearInterval(topRedirectInterval);
    }
}, 1)*/
// Animating the top-banner icon
states.topBannerIcon = 0;
setInterval(() => {
    // Hide all svg frames
    topBannerSVGFrames.forEach((frame) => {
        frame.style.display = "none";
    });
    // Show the current frame
    topBannerSVGFrames[states.topBannerIcon].style.display = "block";
    // Update State
    states.topBannerIcon = (states.topBannerIcon + 1) % topBannerSVGFrames.length;
}, 750);
// Adding Event Listeners to All redirectableElements
redirectableElements.forEach((redirectableElement) => {
    redirectableElement.addEventListener("click", () => {
        redirect(redirectableElement.dataset.redirectUrl, redirectableElement.dataset.redirectTarget);
    });
});
