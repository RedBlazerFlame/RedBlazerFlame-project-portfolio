import { redirect } from "/root/text-redirect.js";

// Declaring Constants and Variables
const redirectableElements: Array<HTMLElement> = [
    ...document.querySelectorAll('div[data-can-redirect="true"]'),
] as Array<HTMLElement>;
const textareaInputTextElement: HTMLTextAreaElement = document.querySelector(
    "textarea#text-input"
) as HTMLTextAreaElement;
const classifyButtonElement: HTMLButtonElement = document.querySelector(
    "button.classify-text-button"
) as HTMLButtonElement;
const typeProbabilitiesElement: HTMLDivElement = document.querySelector(
    "div.type-probabilities"
) as HTMLDivElement;
const functionProbabilitiesElement: HTMLDivElement = document.querySelector(
    "div.function-probabilities"
) as HTMLDivElement;

const mostLikelyTypeCodeElement: HTMLElement = document.querySelector(
    "b#most-likely-type-code"
) as HTMLElement;

const mostLikelyTypeCodeConfidenceElement: HTMLSpanElement = document.querySelector(
    "span#most-likely-type-code-confidence"
) as HTMLSpanElement;

// Declaring Functions
const customElements: {[key: string]: (...args: any) => HTMLElement} = {
    progressBar: (label: string, stringValue: string, value: number, maxValue: number): HTMLElement => {
        /*
        <div class = "progress-bar">
            <span class = "progress-bar-label">ISFJ</span><progress value = "12.5" max = "100"></progress><span class = "progress-bar-value">6.25%</span>
        </div>
        */
        let progressBarLabel: HTMLSpanElement = document.createElement("span");
        progressBarLabel.appendChild(document.createTextNode(label));
        progressBarLabel.classList.add("progress-bar-label");

        let progressElement: HTMLProgressElement = document.createElement("progress");
        progressElement.value = value;
        progressElement.max = maxValue;
        
        let progressBarValueElement: HTMLSpanElement = document.createElement("span");
        progressBarValueElement.appendChild(document.createTextNode(stringValue));
        progressBarValueElement.classList.add("progress-bar-value");

        let divWrapper: HTMLDivElement = document.createElement("div");

        for (let element of [progressBarLabel, progressElement, progressBarValueElement]) {
            divWrapper.appendChild(element);
        }
        
        divWrapper.classList.add("progress-bar");

        return divWrapper;
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

// Wrapping Main Code in an asynchronous function (in order to use await)
(async function main() {
    // Declaring Constants and Variables
const ALPHA = 1;
const SEGREGATED_DATA_DIRECTORY: string = "./application-segregatedMBTIData.json";
const WORD_FREQUENCY_BY_MBTI_TYPE_DIRECTORY: string =
    "./application-wordFrequencyByMBTITypeNormalized.json";
const WORD_FREQUENCY_BY_COGNITIVE_FUNCTION_DIRECTORY: string =
    "./application-wordFrequencyByCognitiveFunctionNormalized.json";
type MBTIType = `${"I" | "E"}${"S" | "N"}${"F" | "T"}${"J" | "P"}`;
type CognitiveFunction = `${"F" | "T" | "N" | "S"}${"I" | "E"}`;
type DataEntry = { type: MBTIType; posts: Array<Array<string>> };
type WordEntryCognitiveData = {usageByCognitiveFunction: Map<CognitiveFunction, number>, totalUses: number};
type WordEntryMBTIData = {usageByType: Map<MBTIType, number>, totalUses: number};
const EPSILON: number = Math.pow(10, -8)
const MBTI_TO_NUMBER_MAP: Map<MBTIType, number> = new Map([
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
const NUMBER_TO_MBTI_MAP: Map<number, MBTIType> = new Map([
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
const MBTI_TYPE_COGNITIVE_FUNCTIONS: Map<MBTIType, Array<CognitiveFunction>> = new Map([
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
const ALL_COGNITIVE_FUNCTIONS: Array<CognitiveFunction> = [
    "NE",
    "NI",
    "SE",
    "SI",
    "FE",
    "FI",
    "TE",
    "TI"
];
const MBTI_TYPES: Array<MBTIType> = [...MBTI_TO_NUMBER_MAP.keys()];
const COGNITIVE_FUNCTION_WEIGHTS: Array<number> = [10, 8, 2, -5];

// Declaring Functions

/// Converts a string of text into words
function convertStringIntoArray(inputString: string): Array<string> {
    let processedString: string = inputString
        .split("")
        .map((character: string): string => {
            if (
                [
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
                ].includes(character)
            ) {
                return " ";
            } else {
                return character;
            }
        })
        .join("");
    return processedString.split(" ").filter((item) => item !== "");
}

/// Converts a string of text into words (lowercase)
function convertStringIntoLowercaseArray(inputString: string): Array<string> {
    let processedString: string = inputString
        .split("")
        .map((character: string): string => {
            if (
                [
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
                ].includes(character)
            ) {
                return " ";
            } else {
                return character.toLowerCase();
            }
        })
        .join("");
    return processedString.split(" ").filter((item) => item !== "");
}

/// Turns all words into lowercase
function turnWordArrayToLowercase(wordArray: Array<string>): Array<string> {
    return wordArray.map((word) => word.toLowerCase());
}

/// Sigmoid Function
function sigmoid(x: number, sensitivity: number = 1): number {
    return 1 / (1 + Math.exp(sensitivity * x));
}

/// Inverse Sigmoid Function
function inverseSigmoid(x: number): number {
    return - Math.log(1 - x + EPSILON) + Math.log(x + EPSILON)
}

// Processing Data
const WORD_SLICE_INDEX = 0;
const WORD_LAST_SLICE_INDEX = 0;
const SEGREGATED_MBTI_DATA: Map<MBTIType, Array<string>> = new Map(
    await fetch(SEGREGATED_DATA_DIRECTORY, {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         }
      }).then(res => res.json())
);
const TOTAL_WORD_USES: number = [...SEGREGATED_MBTI_DATA.values()].reduce(
    (acc: number, cur: Array<string>): number => acc + cur.length,
    0
);
const MBTI_TYPE_PROBABILITIES: Map<MBTIType, number> = new Map(
    [...SEGREGATED_MBTI_DATA.entries()].map(
        (item: [MBTIType, Array<string>]): [MBTIType, number] => [
            item[0],
            item[1].length / TOTAL_WORD_USES,
        ]
    )
);
const RAW_WORD_FREQUENCY_BY_COGNITIVE_FUNCTION_DATA = JSON.parse(
    await fetch(WORD_FREQUENCY_BY_COGNITIVE_FUNCTION_DIRECTORY, {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         }
      }).then(res => res.text())
);
const WORD_FREQUENCY_BY_COGNITIVE_FUNCTION_DATA: Map<string, WordEntryCognitiveData> = new Map(
    RAW_WORD_FREQUENCY_BY_COGNITIVE_FUNCTION_DATA
        .map((item) => {
            return [
                item[0],
                {
                    totalUses: item[1].totalUses,
                    usageByCognitiveFunction: new Map(item[1].usageByCognitiveFunction),
                },
            ];
        })
        .slice(WORD_SLICE_INDEX, RAW_WORD_FREQUENCY_BY_COGNITIVE_FUNCTION_DATA.length - WORD_LAST_SLICE_INDEX)
);
const WORD_FREQUENCY_BY_MBTI_TYPE_DATA: Map<string, WordEntryMBTIData> = new Map(
        (await fetch(WORD_FREQUENCY_BY_MBTI_TYPE_DIRECTORY, {
            headers : { 
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
        .slice(WORD_SLICE_INDEX, RAW_WORD_FREQUENCY_BY_COGNITIVE_FUNCTION_DATA.length - WORD_LAST_SLICE_INDEX)
);

function getCognitiveFunctionProbabilities(inputString: string): Map<CognitiveFunction, number> {
    let currentProbabilities: Map<CognitiveFunction, number> = new Map(
        ALL_COGNITIVE_FUNCTIONS.map((cognitiveFunction) => [
            cognitiveFunction,
            1// MBTI_TYPE_PROBABILITIES.get(typeCode),
        ])
    );

    let inputWords: Array<string> = convertStringIntoLowercaseArray(inputString);

    let classifiableWords = 0;

    for (let word of inputWords) {
        if (WORD_FREQUENCY_BY_COGNITIVE_FUNCTION_DATA.has(word)) {
            let wordFrequencyEntry: WordEntryCognitiveData =
            WORD_FREQUENCY_BY_COGNITIVE_FUNCTION_DATA.get(word);
            for (let [cognitiveFunction, functionProbability] of currentProbabilities.entries()) {
                currentProbabilities.set(
                    cognitiveFunction,
                    functionProbability * (wordFrequencyEntry.usageByCognitiveFunction.get(cognitiveFunction) + ALPHA) /
                    (wordFrequencyEntry.totalUses + ALPHA * 8)
                );
                // currentProbabilities.set(
                //     typeCode,
                //     currentProbabilities.get(typeCode) /
                //     Math.pow(MBTI_TYPE_PROBABILITIES.get(typeCode), 1)
                // );
            }
            let currentProbabilitiesTotal: number = [
                ...currentProbabilities.values(),
            ].reduce((acc, cur) => acc + cur);
            for (let cognitiveFunction of currentProbabilities.keys()) {
                currentProbabilities.set(
                    cognitiveFunction,
                    currentProbabilities.get(cognitiveFunction) / currentProbabilitiesTotal
                );
            }
            classifiableWords++;
        }
    }

    // Normalizing the results to the range [0, 1]
    let currentProbabilitiesTotal: number = [
        ...currentProbabilities.values(),
    ].reduce((acc, cur) => acc + cur);
    for (let cognitiveFunction of currentProbabilities.keys()) {
        currentProbabilities.set(
            cognitiveFunction,
            currentProbabilities.get(cognitiveFunction) / currentProbabilitiesTotal
        );
    }

    // I found that the classifier is a bit too confident when classifying cognitive functions in a long string of text, which is why I passed the outputs through an inverse sigmoid
    for (let cognitiveFunction of currentProbabilities.keys()) {
        currentProbabilities.set(
            cognitiveFunction,
            inverseSigmoid(currentProbabilities.get(cognitiveFunction))
        );
    }

    // Making all outputs positive (by subtracting the minimum value to each "logit")
    let currentProbabilitiesMinimum = [
        ...currentProbabilities.values(),
    ].reduce((acc, cur) => Math.min(acc, cur));
    for (let cognitiveFunction of currentProbabilities.keys()) {
        currentProbabilities.set(
            cognitiveFunction,
            currentProbabilities.get(cognitiveFunction) - currentProbabilitiesMinimum
        );
    }
    
    // Normalizing Outputs to the range [0, 1] again
    currentProbabilitiesTotal = [
        ...currentProbabilities.values(),
    ].reduce((acc, cur) => acc + cur);
    for (let cognitiveFunction of currentProbabilities.keys()) {
        currentProbabilities.set(
            cognitiveFunction,
            currentProbabilities.get(cognitiveFunction) / currentProbabilitiesTotal
        );
    }

    // Running outputs through softmax
    currentProbabilitiesTotal = [
        ...currentProbabilities.values(),
    ].reduce((acc, cur) => acc + Math.exp(0.5 * cur));
    for (let cognitiveFunction of currentProbabilities.keys()) {
        currentProbabilities.set(
            cognitiveFunction,
            Math.exp(0.5 * currentProbabilities.get(cognitiveFunction)) / currentProbabilitiesTotal
        );
    }

    if (classifiableWords > 0) {
        return currentProbabilities;
    } else {
        return new Map(ALL_COGNITIVE_FUNCTIONS.map((cognitiveFunction) => [cognitiveFunction, 1 / 8]));
    }
}

function getTypeProbabilitiesFromCognitiveFunctions(cognitiveFunctionProbabilities: Map<CognitiveFunction, number>): Map<MBTIType, number> {
    let typeProbabilities: Map<MBTIType, number> = new Map(
        MBTI_TYPES.map((typeCode) => [
            typeCode,
            1// MBTI_TYPE_PROBABILITIES.get(typeCode),
        ])
    );

    for(let typeCode of typeProbabilities.keys()) {
        let cognitiveFunctions: Array<CognitiveFunction> = MBTI_TYPE_COGNITIVE_FUNCTIONS.get(typeCode);
        let typeProbability: number = cognitiveFunctions.reduce((acc: number, cur: CognitiveFunction, index: number): number => acc + cognitiveFunctionProbabilities.get(cur) * COGNITIVE_FUNCTION_WEIGHTS[index], 0);
        typeProbabilities.set(typeCode, typeProbability);
    }
    const TYPE_TOTAL_PROBABILITY: number = [...typeProbabilities.values()].reduce((acc: number, cur: number): number => acc + Math.exp(5 * cur), 0);
    for(let typeCode of typeProbabilities.keys()) {
        typeProbabilities.set(typeCode, Math.exp(5 * typeProbabilities.get(typeCode)) / TYPE_TOTAL_PROBABILITY);
    }

    return typeProbabilities;
}

function getMBTITypeProbabilities(inputString: string): Map<MBTIType, number> {
    let currentProbabilities: Map<MBTIType, number> = new Map(
        MBTI_TYPES.map((typeCode) => [
            typeCode,
            1// MBTI_TYPE_PROBABILITIES.get(typeCode),
        ])
    );

    let inputWords: Array<string> = convertStringIntoLowercaseArray(inputString);

    let classifiableWords = 0;

    for (let word of inputWords) {
        if (WORD_FREQUENCY_BY_MBTI_TYPE_DATA.has(word)) {
            let wordFrequencyEntry: WordEntryMBTIData =
                WORD_FREQUENCY_BY_MBTI_TYPE_DATA.get(word);
            for (let [typeCode, typeProbability] of currentProbabilities.entries()) {
                currentProbabilities.set(
                    typeCode,
                    typeProbability * (wordFrequencyEntry.usageByType.get(typeCode) + ALPHA) /
                    (wordFrequencyEntry.totalUses + ALPHA * 16)
                );
                // currentProbabilities.set(
                //     typeCode,
                //     currentProbabilities.get(typeCode) /
                //     Math.pow(MBTI_TYPE_PROBABILITIES.get(typeCode), 1)
                // );
            }
            let currentProbabilitiesTotal: number = [
                ...currentProbabilities.values(),
            ].reduce((acc, cur) => acc + cur);
            for (let typeCode of currentProbabilities.keys()) {
                currentProbabilities.set(
                    typeCode,
                    currentProbabilities.get(typeCode) / currentProbabilitiesTotal
                );
            }
            classifiableWords++;
        }
    }

    // Normalizing the results to the range [0, 1]
    let currentProbabilitiesTotal: number = [
        ...currentProbabilities.values(),
    ].reduce((acc, cur) => acc + cur);
    for (let cognitiveFunction of currentProbabilities.keys()) {
        currentProbabilities.set(
            cognitiveFunction,
            currentProbabilities.get(cognitiveFunction) / currentProbabilitiesTotal
        );
    }

    // Text classifier is too confident sometimes, artificially make the outputs closer to give more human-readable results
    for (let cognitiveFunction of currentProbabilities.keys()) {
        currentProbabilities.set(
            cognitiveFunction,
            inverseSigmoid(currentProbabilities.get(cognitiveFunction))
        );
    }

    // Making all outputs positive (by subtracting the minimum value to each "logit")
    let currentProbabilitiesMinimum = [
        ...currentProbabilities.values(),
    ].reduce((acc, cur) => Math.min(acc, cur));
    for (let cognitiveFunction of currentProbabilities.keys()) {
        currentProbabilities.set(
            cognitiveFunction,
            currentProbabilities.get(cognitiveFunction) - currentProbabilitiesMinimum
        );
    }
    
    // Normalizing Outputs to the range [0, 1] again
    currentProbabilitiesTotal = [
        ...currentProbabilities.values(),
    ].reduce((acc, cur) => acc + cur);
    for (let cognitiveFunction of currentProbabilities.keys()) {
        currentProbabilities.set(
            cognitiveFunction,
            currentProbabilities.get(cognitiveFunction) / currentProbabilitiesTotal
        );
    }

    // Running outputs through softmax
    currentProbabilitiesTotal = [
        ...currentProbabilities.values(),
    ].reduce((acc, cur) => acc + Math.exp(10 * cur));
    for (let cognitiveFunction of currentProbabilities.keys()) {
        currentProbabilities.set(
            cognitiveFunction,
            Math.exp(10 * currentProbabilities.get(cognitiveFunction)) / currentProbabilitiesTotal
        );
    }

    if (classifiableWords > 0) {
        return currentProbabilities;
    } else {
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

        while(functionProbabilitiesElement.hasChildNodes()) {
            functionProbabilitiesElement.removeChild(functionProbabilitiesElement.firstChild);
        }

        while(typeProbabilitiesElement.hasChildNodes()) {
            typeProbabilitiesElement.removeChild(typeProbabilitiesElement.firstChild);
        }

        resultProbabilities.forEach(([cognitiveFunction, probability]) => {
            let progressBarElement: HTMLElement = customElements.progressBar(cognitiveFunction, `${Math.round(probability * 10000) / 100}%`, probability * 100, 100);

            functionProbabilitiesElement.appendChild(progressBarElement);
        });

        cognitiveTypeProbabilities.forEach(([typeCode, probability]) => {
            let progressBarElement: HTMLElement = customElements.progressBar(typeCode, `${Math.round(probability * 10000) / 100}%`, probability * 100, 100);

            typeProbabilitiesElement.appendChild(progressBarElement);
        });

        mostLikelyTypeCodeElement.innerText = cognitiveTypeProbabilities[0][0];
        mostLikelyTypeCodeConfidenceElement.innerText = `${Math.round(cognitiveTypeProbabilities[0][1] * 10000) / 100}`;
        
        console.dir(resultProbabilities);
        console.dir(cognitiveTypeProbabilities);

        classifyButtonElement.blur();
    });
})();
