/*
Numerical Recipes	2³²	1664525	1013904223
Borland C/C++	2³²	22695477	1	bits 30..16 in rand(), 30..0 in lrand()
glibc (used by GCC)[9]	2³¹	1103515245	12345	bits 30..0
ANSI C: Watcom, Digital Mars, CodeWarrior, IBM VisualAge C/C++ [10]
C90, C99, C11: Suggestion in the ISO/IEC 9899 [11], C18	2³¹	1103515245	12345	bits 30..16
 */

class LinearCongruentialGenerator {

    constructor(modulus, multiplier, increment, lowestBit = 0, highestBit = Math.log2(modulus) - 1) {
        this.shift = lowestBit;
        this.mask = bitmask(highestBit - lowestBit + 1);
        this.m = modulus;
        this.a = multiplier;
        this.c = increment;
    }

    apply(input) {
        return ((input * this.a + this.c) >> this.shift) & this.shift;
    }

}

const NUMRECIPES = new LinearCongruentialGenerator(pow2(32), 1664525, 1013904223);
const BORLAND = new LinearCongruentialGenerator(pow2(32), 22695477, 1, 0, 30);
const GLIBC = new LinearCongruentialGenerator(pow2(31), 1103515245, 12345, 0, 30);
const ANSI_C = new LinearCongruentialGenerator(pow2(31), 1103515245, 12345, 16, 30);

function pow2(exp) {
    return Math.pow(2, exp);
}

function bitmask(length) {
    let result = 0;
    for (let i = 0; i < length; i++) {
        result |= 1 << i;
    }
    return result;
}

function lcg(input, rightshift, bitmask, modulus, multiplier, increment) {
    return ((input * multiplier + increment) >> rightshift) & bitmask;
}
