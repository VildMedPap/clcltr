const calculator = document.getElementById("calculator");
const display = document.getElementById("calculator__display");
const keys = document.getElementById("calculator__keys");

const getKeyType = (key) => {
    const action = key.dataset.action;

    if (!action) return "digit";
    if (
        action === "add" ||
        action === "subtract" ||
        action === "multiply" ||
        action === "divide"
    )
        return "operator";
    return action;
};

const calculate = (n1, operator, n2) => {
    const num1 = parseFloat(n1);
    const num2 = parseFloat(n2);

    if (operator === "add") return num1 + num2;
    if (operator === "subtract") return num1 - num2;
    if (operator === "multiply") return num1 * num2;
    if (operator === "divide") return num1 / num2;
};

const createResultString = (key, displayedNum, state) => {
    const keyType = getKeyType(key);
    const keyContent = key.textContent;
    const firstValue = state.firstValue;
    const modValue = state.modValue;
    const operator = state.operator;
    const previousKeyType = state.previousKeyType;

    // A digit button was clicked
    if (keyType === "digit") {
        return displayedNum === "0" ||
            previousKeyType === "operator" ||
            previousKeyType === "calculate"
            ? keyContent
            : displayedNum + keyContent;
    }

    // The decimal button was clicked
    if (keyType === "decimal") {
        if (previousKeyType === "operator" || previousKeyType === "calculate")
            return "0.";
        if (!displayedNum.includes(".")) return displayedNum + ".";
        return displayedNum;
    }

    // An operator button was clicked
    if (keyType === "operator") {
        const firstValue = calculator.dataset.firstValue;
        const operator = calculator.dataset.operator;

        return firstValue &&
            operator &&
            previousKeyType !== "operator" &&
            previousKeyType !== "calculate"
            ? calculate(firstValue, operator, displayedNum)
            : displayedNum;
    }

    // The clear button was clicked
    if (keyType === "clear") return "0";

    // The calculate button was clicked
    if (keyType === "calculate") {
        const firstValue = calculator.dataset.firstValue;
        const operator = calculator.dataset.operator;
        const modValue = calculator.dataset.modValue;

        return firstValue
            ? previousKeyType === "calculate"
                ? calculate(displayedNum, operator, modValue)
                : calculate(firstValue, operator, displayedNum)
            : displayedNum;
    }
};

const updateCalculatorState = (key, calculator, calcValue, displayedNum) => {
    const keyType = getKeyType(key);
    const firstValue = calculator.dataset.firstValue;
    const operator = calculator.dataset.operator;
    const modValue = calculator.dataset.modValue;
    const previousKeyType = calculator.dataset.previousKeyType;
    calculator.dataset.previousKeyType = keyType;

    // An operator button was clicked
    if (keyType === "operator") {
        calculator.dataset.operator = key.dataset.action;
        calculator.dataset.firstValue =
            firstValue &&
            operator &&
            previousKeyType !== "operator" &&
            previousKeyType !== "calculate"
                ? calcValue
                : displayedNum;
    }

    // The clear button was clicked
    if (keyType === "clear") {
        if (key.textContent === "AC") {
            calculator.dataset.firstValue = "";
            calculator.dataset.modValue = "";
            calculator.dataset.operator = "";
            calculator.dataset.previousKeyType = "";
        } else {
            key.textContent = "AC";
        }
    }

    // The calculate button was clicked
    if (keyType === "calculate") {
        calculator.dataset.modValue =
            firstValue && previousKeyType === "calculate"
                ? modValue
                : displayedNum;
    }
};

const updateVisualState = (key) => {
    const keyType = getKeyType(key);

    // Release operator highligth
    Array.from(key.parentNode.children).forEach((k) =>
        k.classList.remove("btn-pressed")
    );

    // An operator button was clicked
    if (keyType === "operator") key.classList.add("btn-pressed");

    // The clear button was clicked
    if (keyType === "clear" && key.textContent !== "AC") key.textContent = "AC";

    if (keyType !== "clear") {
        const clearBtn = document.getElementById("clear");
        clearBtn.textContent = "CE";
    }
};

keys.addEventListener("click", (mouseEvent) => {
    if (mouseEvent.target.matches("button")) {
        const key = mouseEvent.target;
        const displayedNum = display.textContent;
        const resultString = createResultString(
            key,
            displayedNum,
            calculator.dataset
        );
        display.textContent = resultString;
        updateCalculatorState(key, calculator, resultString, displayedNum);
        updateVisualState(key, calculator);
    }
});
