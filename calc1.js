const limitStr = "Digit Limit Met",
  math = { divide: "/", multiply: "*", plus: "+", minus: "-" };
var buttons = document.querySelectorAll(".btn"),
  firstLine = document.querySelector(".first-line"),
  secondLine = document.querySelector(".second-line");

buttons.forEach((button) => {
  button.addEventListener("click", handlerClick);
});

function handlerClick(e) {
  var button = e.target;
  if (button.classList.contains("btn-number")) {
    clickedNumber(button.value);
  } else if (button.classList.contains("btn-math")) {
    clickedMath(button.value);
  } else {
    clickedOther(button.value);
  }
}

function clickedOther(str) {
  switch (str) {
    case "AC":
      clearDisplay();
      break;
    case "CE":
      clearEntry();
      break;
    case "=":
      executeEquality();
      break;
    case ".":
      setPoint();
      break;
    default:
      break;
  }
}

function clickedNumber(value) {
  var first = firstLine.value,
    second = secondLine.value;
  if (
    (!first ||
      first === math.divide ||
      second[second.length - 1] === math.divide ||
      first == "0") &&
    value == "0"
  ) {
    return;
  }
  if (isIncludeMath(first)) {
    firstLine.value = "";
  }
  if (second.indexOf("=") !== -1 || second === limitStr) {
    clearDisplay();
  }
  firstLine.value += value;
  secondLine.value += value;
  controlLimit();
}

function clickedMath(operation) {
  var first = firstLine.value,
    second = secondLine.value,
    index = second.indexOf("=");

  if (divisionByZero() || secondLine.value.includes(limitStr)) {
    return;
  }

  if (index !== -1) {
    secondLine.value = second.slice(index + 1) + operation;
  } else if (first.length === 0 && second.length === 0) {
    secondLine.value = "0" + operation;
  } else if (first[first.length - 1] === ".") {
    secondLine.value = first.slice(0, first.length - 1) + operation;
  } else {
    secondLine.value += operation;
  }
  firstLine.value = operation;
  controlLimit();
}

function controlLimit() {
  if (
    firstLine.value.length >= firstLine.maxLength ||
    secondLine.value.length >= secondLine.maxLength
  ) {
    clearDisplay();
    secondLine.value = limitStr;
  }
}

function executeEquality() {
  var regMath = /[/]|[*]|[-]|[+]/g,
    result,
    operands = [],
    operations = [],
    str = secondLine.value;
  if (
    !str ||
    isIncludeMath(str[str.length - 1]) ||
    !isIncludeMath(str) ||
    str.indexOf("=") !== -1 ||
    divisionByZero()
  ) {
    return;
  }
  operands = str.split(regMath);
  operands.forEach((operand) => {
    var index = str.indexOf(operand) + operand.length;
    if (index < str.length) {
      operations.push(str[index]);
      str = str.slice(index);
    }
  });

  result = operands.reduce((a, b) => {
    var first = a,
      second = b,
      operation = operations.shift();
    if (!Number.isInteger(first * 1) || !Number.isInteger(second * 1)) {
      let multiplier = Math.pow(10, firstLine.maxLength);
      first *= multiplier;
      second *= multiplier;
      if (operation == math.divide) {
        return calculate(first, second, operation);
      } else if (operation == math.multiply) {
        return calculate(first, second, operation) / Math.pow(multiplier, 2);
      } else {
        return calculate(first, second, operation) / multiplier;
      }
    }
    return calculate(first * 1, second * 1, operation);
  });
  if (!Number.isInteger(result)) {
    result = fixedDecimal(result);
  }
  firstLine.value = result;
  secondLine.value += `=${result}`;
  controlLimit();
}

function calculate(first, second, operation) {
  console.log(first, second);
  switch (operation) {
    case math.divide:
      return first / second;
    case math.multiply:
      return first * second;
    case math.minus:
      return first - second;
    case math.plus:
      return first + second;
    default:
      return NaN;
      break;
  }
}
function fixedDecimal(value) {
  var localVal = value,
    result,
    index,
    floor,
    remainder;

  if (value.toString().indexOf("e") !== -1) {
    localVal = localVal.toFixed(firstLine.maxLength);
  }
  ([floor, remainder] = localVal.toString().split(".")),
    (index = remainder.search(/[1-9]/gi));
  remainder =
    remainder[index + 1] == "0"
      ? remainder.slice(0, index + 1)
      : remainder.slice(0, index + 2);
  result = `${floor}.${remainder}`;
  return result;
}

function clearDisplay() {
  firstLine.value = secondLine.value = "";
}

function setPoint() {
  if (
    secondLine.value.indexOf("=") !== -1 ||
    secondLine.value.includes(limitStr)
  ) {
    clearDisplay();
  }
  if (
    !firstLine.value ||
    isIncludeMath(firstLine.value[firstLine.value.length - 1])
  ) {
    firstLine.value = "0.";
    secondLine.value += "0.";
    return;
  }
  if (firstLine.value.indexOf(".") === -1) {
    firstLine.value += ".";
    secondLine.value += ".";
  }
}

function clearEntry() {
  var str = secondLine.value;
  if (!str || str.indexOf("=") !== -1) {
    clearDisplay();
    return;
  }
  if (isIncludeMath(str[str.length - 1])) {
    str = str.slice(0, str.length - 1);
  } else {
    while (!isIncludeMath(str[str.length - 1])) {
      if (str.length == 1) {
        str = "";
        break;
      }
      str = str.slice(0, str.length - 1);
    }
  }
  secondLine.value = str;
  firstLine.value = "";
  return;
}

function isIncludeMath(str) {
  for (let operation in math) {
    if (str.indexOf(math[operation]) !== -1) {
      return true;
    }
  }
  return false;
}

function divisionByZero() {
  var first = firstLine.value,
    second = secondLine.value;
  if (first == 0 && second[second.indexOf(first) - 1] === "/") {
    return true;
  }
  return false;
}
