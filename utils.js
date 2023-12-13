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

/**
 * Checks if a given element exists in the array.
 * @param {any} element - The element to check for existence.
 * @param {Array} array - The array to search for the element.
 * @returns {boolean} - True if the element exists in the array, false otherwise.
 */
const checkElementExistsInArray = (element = [], array = []) => {
  const elString = JSON.stringify(element);
  const arrString = JSON.stringify(array);

  return arrString.includes(elString);
};

module.exports = {
  checkElementExistsInArray,
  countOnesInBinary,
  isPowerOfTwo,
  sortingFn,
};
