const MOD = 2147483648;

function randu(n) {
    return n * 65539 % MOD;
}

function onRanduInput(elementIn, elementOut) {
    let inValue = parseInt(elementIn.value);
    elementIn.value = Math.max(0, Math.min(MOD, inValue));
    elementOut.value =  randu(inValue);
}

function onRanduButton(elementIn, elementOut) {
    elementIn.value = parseInt(elementOut.value);
    onRanduInput(elementIn, elementOut);
}
