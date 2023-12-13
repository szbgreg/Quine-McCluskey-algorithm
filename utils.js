/**
 * Counts the number of ones in the binary representation of the given number.
 * @param {number} number - An integer for which the count of ones in its binary representation is to be calculated.
 * @returns {number} Returns an integer representing the count of ones in the binary representation of the input number.
 */
const countOnesInBinary = (number) => {
  return number.toString(2).split('1').length - 1;
};

/**
 * Checks if a given number is a power of two.
 * @param {number} number - The number to be checked.
 * @returns {boolean} Returns true if the number is a power of two, otherwise returns false.
 */
const isPowerOfTwo = (number) => {
  return Math.log2(number) % 1 === 0;
};

/**
 * Custom comparator function for sorting numbers in ascending order.
 * @param {number} a - The first number to compare.
 * @param {number} b - The second number to compare.
 * @returns {number} Returns -1 if 'a' is less than 'b', and 1 if 'a' is greater than 'b'.
 */
const sortingFn = (a, b) => {
  if (a < b) {
    return -1;
  } else {
    return 1;
  }
};
module.exports = {
  countOnesInBinary,
  isPowerOfTwo,
  sortingFn,
};
