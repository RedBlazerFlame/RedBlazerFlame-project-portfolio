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
const redirectableElements = [
    ...document.querySelectorAll('div[data-can-redirect="true"]'),
];
const textareaInputTextElement = document.querySelector("textarea#text-input");
const classifyButtonElement = document.querySelector("button.classify-text-button");
const typeProbabilitiesElement = document.querySelector("div.type-probabilities");
const functionProbabilitiesElement = document.querySelector("div.function-probabilities");
const mostLikelyTypeCodeElement = document.querySelector("b#most-likely-type-code");
const mostLikelyTypeCodeConfidenceElement = document.querySelector("span#most-likely-type-code-confidence");
// Declaring Functions
const customElements = {
    progressBar: (label, stringValue, value, maxValue) => {
        /*
        <div class = "progress-bar">
            <span class = "progress-bar-label">ISFJ</span><progress value = "12.5" max = "100"></progress><span class = "progress-bar-value">6.25%</span>
        </div>
        */
        let progressBarLabel = document.createElement("span");
        progressBarLabel.appendChild(document.createTextNode(label));
        progressBarLabel.classList.add("progress-bar-label");
        let progressElement = document.createElement("progress");
        progressElement.value = value;
        progressElement.max = maxValue;
        let progressBarValueElement = document.createElement("span");
        progressBarValueElement.appendChild(document.createTextNode(stringValue));
        progressBarValueElement.classList.add("progress-bar-value");
        let divWrapper = document.createElement("div");
        for (let element of [progressBarLabel, progressElement, progressBarValueElement]) {
            divWrapper.appendChild(element);
        }
        divWrapper.classList.add("progress-bar");
        return divWrapper;
    }
};
// Adding Event Listeners to All redirectableElements
redirectableElements.forEach((redirectableElement) => {
    redirectableElement.addEventListener("click", () => {
        redirect(redirectableElement.dataset.redirectUrl, redirectableElement.dataset.redirectTarget);
    });
});
// Wrapping Main Code in an asynchronous function (in order to use await)
(function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Declaring Constants and Variables
        const ALPHA = 1;
        const SEGREGATED_DATA_DIRECTORY = "./application-segregatedMBTIData.json";
        const WORD_FREQUENCY_BY_MBTI_TYPE_DIRECTORY = "./application-wordFrequencyByMBTITypeNormalized.json";
        const WORD_FREQUENCY_BY_COGNITIVE_FUNCTION_DIRECTORY = "./application-wordFrequencyByCognitiveFunctionNormalized.json";
        const EPSILON = Math.pow(10, -8);
        const MBTI_TO_NUMBER_MAP = new Map([
            ["ISFJ", 0],
            ["ISFP", 1],
            ["ISTJ", 2],
            ["ISTP", 3],
            ["INFJ", 4],
            ["INFP", 5],
            ["INTJ", 6],
            ["INTP", 7],
            ["ESFJ", 8],
            ["ESFP", 9],
            ["ESTJ", 10],
            ["ESTP", 11],
            ["ENFJ", 12],
            ["ENFP", 13],
            ["ENTJ", 14],
            ["ENTP", 15],
        ]);
        const NUMBER_TO_MBTI_MAP = new Map([
            [0, "ISFJ"],
            [1, "ISFP"],
            [2, "ISTJ"],
            [3, "ISTP"],
            [4, "INFJ"],
            [5, "INFP"],
            [6, "INTJ"],
            [7, "INTP"],
            [8, "ESFJ"],
            [9, "ESFP"],
            [10, "ESTJ"],
            [11, "ESTP"],
            [12, "ENFJ"],
            [13, "ENFP"],
            [14, "ENTJ"],
            [15, "ENTP"],
        ]);
        const MBTI_TYPE_COGNITIVE_FUNCTIONS = new Map([
            ["ISFJ", ["SI", "FE", "TI", "NE"]],
            ["ISFP", ["FI", "SE", "NI", "TE"]],
            ["ISTJ", ["SI", "TE", "FI", "NE"]],
            ["ISTP", ["TI", "SE", "NI", "FE"]],
            ["INFJ", ["NI", "FE", "TI", "SE"]],
            ["INFP", ["FI", "NE", "SI", "TE"]],
            ["INTJ", ["NI", "TE", "FI", "SE"]],
            ["INTP", ["TI", "NE", "SI", "FE"]],
            ["ESFJ", ["FE", "SI", "NE", "TI"]],
            ["ESFP", ["SE", "FI", "TE", "NI"]],
            ["ESTJ", ["TE", "SI", "NE", "FI"]],
            ["ESTP", ["SE", "TI", "FE", "NI"]],
            ["ENFJ", ["FE", "NI", "SE", "TI"]],
            ["ENFP", ["NE", "FI", "TE", "SI"]],
            ["ENTJ", ["TE", "NI", "SE", "FI"]],
            ["ENTP", ["NE", "TI", "FE", "SI"]],
        ]);
        const ALL_COGNITIVE_FUNCTIONS = [
            "NE",
            "NI",
            "SE",
            "SI",
            "FE",
            "FI",
            "TE",
            "TI"
        ];
        const MBTI_TYPES = [...MBTI_TO_NUMBER_MAP.keys()];
        const COGNITIVE_FUNCTION_WEIGHTS = [10, 8, 2, -5];
        // Declaring Functions
        /// Converts a string of text into words
        function convertStringIntoArray(inputString) {
            let processedString = inputString
                .split("")
                .map((character) => {
                if ([
                    ".",
                    "!",
                    "?",
                    ":",
                    ";",
                    "<",
                    ">",
                    "/",
                    ",",
                    "\\",
                    "]",
                    "[",
                    "}",
                    "{",
                    ")",
                    "(",
                    "*",
                    "&",
                    "^",
                    "%",
                    "$",
                    "#",
                    "@",
                    "~",
                    "=",
                    "+",
                    "_",
                ].includes(character)) {
                    return " ";
                }
                else {
                    return character;
                }
            })
                .join("");
            return processedString.split(" ").filter((item) => item !== "");
        }
        /// Converts a string of text into words (lowercase)
        function convertStringIntoLowercaseArray(inputString) {
            let processedString = inputString
                .split("")
                .map((character) => {
                if ([
                    ".",
                    "!",
                    "?",
                    ":",
                    ";",
                    "<",
                    ">",
                    "/",
                    ",",
                    "\\",
                    "]",
                    "[",
                    "}",
                    "{",
                    ")",
                    "(",
                    "*",
                    "&",
                    "^",
                    "%",
                    "$",
                    "#",
                    "@",
                    "~",
                    "=",
                    "+",
                    "_",
                ].includes(character)) {
                    return " ";
                }
                else {
                    return character.toLowerCase();
                }
            })
                .join("");
            return processedString.split(" ").filter((item) => item !== "");
        }
        /// Turns all words into lowercase
        function turnWordArrayToLowercase(wordArray) {
            return wordArray.map((word) => word.toLowerCase());
        }
        /// Sigmoid Function
        function sigmoid(x, sensitivity = 1) {
            return 1 / (1 + Math.exp(sensitivity * x));
        }
        /// Inverse Sigmoid Function
        function inverseSigmoid(x) {
            return -Math.log(1 - x + EPSILON) + Math.log(x + EPSILON);
        }
        // Processing Data
        const WORD_SLICE_INDEX = 0;
        const WORD_LAST_SLICE_INDEX = 0;
        const SEGREGATED_MBTI_DATA = new Map(yield fetch(SEGREGATED_DATA_DIRECTORY, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(res => res.json()));
        const TOTAL_WORD_USES = [...SEGREGATED_MBTI_DATA.values()].reduce((acc, cur) => acc + cur.length, 0);
        const MBTI_TYPE_PROBABILITIES = new Map([...SEGREGATED_MBTI_DATA.entries()].map((item) => [
            item[0],
            item[1].length / TOTAL_WORD_USES,
        ]));
        const RAW_WORD_FREQUENCY_BY_COGNITIVE_FUNCTION_DATA = JSON.parse(yield fetch(WORD_FREQUENCY_BY_COGNITIVE_FUNCTION_DIRECTORY, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(res => res.text()));
        const WORD_FREQUENCY_BY_COGNITIVE_FUNCTION_DATA = new Map(RAW_WORD_FREQUENCY_BY_COGNITIVE_FUNCTION_DATA
            .map((item) => {
            return [
                item[0],
                {
                    totalUses: item[1].totalUses,
                    usageByCognitiveFunction: new Map(item[1].usageByCognitiveFunction),
                },
            ];
        })
            .slice(WORD_SLICE_INDEX, RAW_WORD_FREQUENCY_BY_COGNITIVE_FUNCTION_DATA.length - WORD_LAST_SLICE_INDEX));
        const WORD_FREQUENCY_BY_MBTI_TYPE_DATA = new Map((yield fetch(WORD_FREQUENCY_BY_MBTI_TYPE_DIRECTORY, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(res => res.json()))
            .map((item) => {
            return [
                item[0],
                {
                    totalUses: item[1].totalUses,
                    usageByType: new Map(item[1].usageByType),
                },
            ];
        })
            .slice(WORD_SLICE_INDEX, RAW_WORD_FREQUENCY_BY_COGNITIVE_FUNCTION_DATA.length - WORD_LAST_SLICE_INDEX));
        function getCognitiveFunctionProbabilities(inputString) {
            let currentProbabilities = new Map(ALL_COGNITIVE_FUNCTIONS.map((cognitiveFunction) => [
                cognitiveFunction,
                1 // MBTI_TYPE_PROBABILITIES.get(typeCode),
            ]));
            let inputWords = convertStringIntoLowercaseArray(inputString);
            let classifiableWords = 0;
            for (let word of inputWords) {
                if (WORD_FREQUENCY_BY_COGNITIVE_FUNCTION_DATA.has(word)) {
                    let wordFrequencyEntry = WORD_FREQUENCY_BY_COGNITIVE_FUNCTION_DATA.get(word);
                    for (let [cognitiveFunction, functionProbability] of currentProbabilities.entries()) {
                        currentProbabilities.set(cognitiveFunction, functionProbability * (wordFrequencyEntry.usageByCognitiveFunction.get(cognitiveFunction) + ALPHA) /
                            (wordFrequencyEntry.totalUses + ALPHA * 8));
                        // currentProbabilities.set(
                        //     typeCode,
                        //     currentProbabilities.get(typeCode) /
                        //     Math.pow(MBTI_TYPE_PROBABILITIES.get(typeCode), 1)
                        // );
                    }
                    let currentProbabilitiesTotal = [
                        ...currentProbabilities.values(),
                    ].reduce((acc, cur) => acc + cur);
                    for (let cognitiveFunction of currentProbabilities.keys()) {
                        currentProbabilities.set(cognitiveFunction, currentProbabilities.get(cognitiveFunction) / currentProbabilitiesTotal);
                    }
                    classifiableWords++;
                }
            }
            // Normalizing the results to the range [0, 1]
            let currentProbabilitiesTotal = [
                ...currentProbabilities.values(),
            ].reduce((acc, cur) => acc + cur);
            for (let cognitiveFunction of currentProbabilities.keys()) {
                currentProbabilities.set(cognitiveFunction, currentProbabilities.get(cognitiveFunction) / currentProbabilitiesTotal);
            }
            // I found that the classifier is a bit too confident when classifying cognitive functions in a long string of text, which is why I passed the outputs through an inverse sigmoid
            for (let cognitiveFunction of currentProbabilities.keys()) {
                currentProbabilities.set(cognitiveFunction, inverseSigmoid(currentProbabilities.get(cognitiveFunction)));
            }
            // Making all outputs positive (by subtracting the minimum value to each "logit")
            let currentProbabilitiesMinimum = [
                ...currentProbabilities.values(),
            ].reduce((acc, cur) => Math.min(acc, cur));
            for (let cognitiveFunction of currentProbabilities.keys()) {
                currentProbabilities.set(cognitiveFunction, currentProbabilities.get(cognitiveFunction) - currentProbabilitiesMinimum);
            }
            // Normalizing Outputs to the range [0, 1] again
            currentProbabilitiesTotal = [
                ...currentProbabilities.values(),
            ].reduce((acc, cur) => acc + cur);
            for (let cognitiveFunction of currentProbabilities.keys()) {
                currentProbabilities.set(cognitiveFunction, currentProbabilities.get(cognitiveFunction) / currentProbabilitiesTotal);
            }
            // Running outputs through softmax
            currentProbabilitiesTotal = [
                ...currentProbabilities.values(),
            ].reduce((acc, cur) => acc + Math.exp(0.5 * cur));
            for (let cognitiveFunction of currentProbabilities.keys()) {
                currentProbabilities.set(cognitiveFunction, Math.exp(0.5 * currentProbabilities.get(cognitiveFunction)) / currentProbabilitiesTotal);
            }
            if (classifiableWords > 0) {
                return currentProbabilities;
            }
            else {
                return new Map(ALL_COGNITIVE_FUNCTIONS.map((cognitiveFunction) => [cognitiveFunction, 1 / 8]));
            }
        }
        function getTypeProbabilitiesFromCognitiveFunctions(cognitiveFunctionProbabilities) {
            let typeProbabilities = new Map(MBTI_TYPES.map((typeCode) => [
                typeCode,
                1 // MBTI_TYPE_PROBABILITIES.get(typeCode),
            ]));
            for (let typeCode of typeProbabilities.keys()) {
                let cognitiveFunctions = MBTI_TYPE_COGNITIVE_FUNCTIONS.get(typeCode);
                let typeProbability = cognitiveFunctions.reduce((acc, cur, index) => acc + cognitiveFunctionProbabilities.get(cur) * COGNITIVE_FUNCTION_WEIGHTS[index], 0);
                typeProbabilities.set(typeCode, typeProbability);
            }
            const TYPE_TOTAL_PROBABILITY = [...typeProbabilities.values()].reduce((acc, cur) => acc + Math.exp(5 * cur), 0);
            for (let typeCode of typeProbabilities.keys()) {
                typeProbabilities.set(typeCode, Math.exp(5 * typeProbabilities.get(typeCode)) / TYPE_TOTAL_PROBABILITY);
            }
            return typeProbabilities;
        }
        function getMBTITypeProbabilities(inputString) {
            let currentProbabilities = new Map(MBTI_TYPES.map((typeCode) => [
                typeCode,
                1 // MBTI_TYPE_PROBABILITIES.get(typeCode),
            ]));
            let inputWords = convertStringIntoLowercaseArray(inputString);
            let classifiableWords = 0;
            for (let word of inputWords) {
                if (WORD_FREQUENCY_BY_MBTI_TYPE_DATA.has(word)) {
                    let wordFrequencyEntry = WORD_FREQUENCY_BY_MBTI_TYPE_DATA.get(word);
                    for (let [typeCode, typeProbability] of currentProbabilities.entries()) {
                        currentProbabilities.set(typeCode, typeProbability * (wordFrequencyEntry.usageByType.get(typeCode) + ALPHA) /
                            (wordFrequencyEntry.totalUses + ALPHA * 16));
                        // currentProbabilities.set(
                        //     typeCode,
                        //     currentProbabilities.get(typeCode) /
                        //     Math.pow(MBTI_TYPE_PROBABILITIES.get(typeCode), 1)
                        // );
                    }
                    let currentProbabilitiesTotal = [
                        ...currentProbabilities.values(),
                    ].reduce((acc, cur) => acc + cur);
                    for (let typeCode of currentProbabilities.keys()) {
                        currentProbabilities.set(typeCode, currentProbabilities.get(typeCode) / currentProbabilitiesTotal);
                    }
                    classifiableWords++;
                }
            }
            // Normalizing the results to the range [0, 1]
            let currentProbabilitiesTotal = [
                ...currentProbabilities.values(),
            ].reduce((acc, cur) => acc + cur);
            for (let cognitiveFunction of currentProbabilities.keys()) {
                currentProbabilities.set(cognitiveFunction, currentProbabilities.get(cognitiveFunction) / currentProbabilitiesTotal);
            }
            // Text classifier is too confident sometimes, artificially make the outputs closer to give more human-readable results
            for (let cognitiveFunction of currentProbabilities.keys()) {
                currentProbabilities.set(cognitiveFunction, inverseSigmoid(currentProbabilities.get(cognitiveFunction)));
            }
            // Making all outputs positive (by subtracting the minimum value to each "logit")
            let currentProbabilitiesMinimum = [
                ...currentProbabilities.values(),
            ].reduce((acc, cur) => Math.min(acc, cur));
            for (let cognitiveFunction of currentProbabilities.keys()) {
                currentProbabilities.set(cognitiveFunction, currentProbabilities.get(cognitiveFunction) - currentProbabilitiesMinimum);
            }
            // Normalizing Outputs to the range [0, 1] again
            currentProbabilitiesTotal = [
                ...currentProbabilities.values(),
            ].reduce((acc, cur) => acc + cur);
            for (let cognitiveFunction of currentProbabilities.keys()) {
                currentProbabilities.set(cognitiveFunction, currentProbabilities.get(cognitiveFunction) / currentProbabilitiesTotal);
            }
            // Running outputs through softmax
            currentProbabilitiesTotal = [
                ...currentProbabilities.values(),
            ].reduce((acc, cur) => acc + Math.exp(10 * cur));
            for (let cognitiveFunction of currentProbabilities.keys()) {
                currentProbabilities.set(cognitiveFunction, Math.exp(10 * currentProbabilities.get(cognitiveFunction)) / currentProbabilitiesTotal);
            }
            if (classifiableWords > 0) {
                return currentProbabilities;
            }
            else {
                return new Map(MBTI_TYPES.map((typeCode) => [typeCode, 1 / 16]));
            }
        }
        // Classifier is Ready, update the button's state
        classifyButtonElement.innerText = "Classify";
        // Adding an Event Listener to the Classify Button
        classifyButtonElement.addEventListener("click", (ev) => {
            let inputText = textareaInputTextElement.value;
            let resultProbabilities = [
                ...getCognitiveFunctionProbabilities(inputText).entries(),
            ].sort((a, b) => b[1] - a[1]);
            let cognitiveTypeProbabilities = [
                ...getTypeProbabilitiesFromCognitiveFunctions(new Map(resultProbabilities)).entries(),
            ].sort((a, b) => b[1] - a[1]);
            while (functionProbabilitiesElement.hasChildNodes()) {
                functionProbabilitiesElement.removeChild(functionProbabilitiesElement.firstChild);
            }
            while (typeProbabilitiesElement.hasChildNodes()) {
                typeProbabilitiesElement.removeChild(typeProbabilitiesElement.firstChild);
            }
            resultProbabilities.forEach(([cognitiveFunction, probability]) => {
                let progressBarElement = customElements.progressBar(cognitiveFunction, `${Math.round(probability * 10000) / 100}%`, probability * 100, 100);
                functionProbabilitiesElement.appendChild(progressBarElement);
            });
            cognitiveTypeProbabilities.forEach(([typeCode, probability]) => {
                let progressBarElement = customElements.progressBar(typeCode, `${Math.round(probability * 10000) / 100}%`, probability * 100, 100);
                typeProbabilitiesElement.appendChild(progressBarElement);
            });
            mostLikelyTypeCodeElement.innerText = cognitiveTypeProbabilities[0][0];
            mostLikelyTypeCodeConfidenceElement.innerText = `${Math.round(cognitiveTypeProbabilities[0][1] * 10000) / 100}`;
            console.dir(resultProbabilities);
            console.dir(cognitiveTypeProbabilities);
            classifyButtonElement.blur();
        });
    });
})();
