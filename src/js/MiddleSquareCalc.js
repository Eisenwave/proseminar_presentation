function middleSquare4(n) {
    n *= n;
    n = Math.floor(n / 100);
    n %= 10000;
    return n;
}

function middleSquare6(n) {
    n *= n;
    n = Math.floor(n / 1000);
    n %= 10000000;
    return n;
}

function onMiddleSquareInput(elementIn, elementOut, elementSqr) {
    let inValue = parseInt(elementIn.value);
    if (inValue < 0 || inValue > 9999) {
        inValue %= 10000;
        elementIn.value = inValue;
    }

    elementSqr.value = (inValue * inValue).toString().padStart(8, "0");

    elementOut.value = "  " + middleSquare4(inValue).toString().padStart(4, "0") + "  ";
}

function onMiddleSquareButton(elementIn, elementOut, elementSqr) {
    elementIn.value = parseInt(elementOut.value.substring(2, 6));
    onMiddleSquareInput(elementIn, elementOut, elementSqr);
}
