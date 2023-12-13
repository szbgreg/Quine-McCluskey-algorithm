const {
  isPowerOfTwo,
  sortingFn,
  countOnesInBinary,
  checkElementExistsInArray,
} = require('./utils');

/**
 * QuineMcCluskey class.
 */
module.exports = class QuineMcCluskey {
  /**
   * Constructor for the Quine-McCluskey algorithm class.
   * @param {number} count - A number representing the count of variables.
   * @param {Array} indexes - An array containing the minterm indexes.
   */
  constructor(count, indexes) {
    this.variablesCount = count;
    this.mintermIndexes = indexes;
  }

  /**
   * Gets the count of variables.
   * @returns {number} The count of variables.
   */
  getVariablesCount = () => {
    return this.variablesCount;
  };

  /**
   * Gets the minterm indexes.
   * @returns {Array} An array containing the minterm indexes.
   */
  getMintermIndexes = () => {
    return this.mintermIndexes;
  };

  /**
   * Groups minterm indexes based on the count of '1's in their binary representation.
   * @returns {Array} An array of arrays containing grouped minterm indexes.
   */
  groupMintermIndexes = () => {
    const groups = [];

    this.mintermIndexes.forEach((index) => {
      const count = countOnesInBinary(index);
      const newElement = { indexes: [index], used: false, diff: null };

      groups[count] = groups[count]
        ? [...groups[count], newElement]
        : [newElement];
    });

    // Remove groups without elements
    return groups.filter(Boolean);
  };

  /**
   * #getDifference - Calculates the power of 2 difference between corresponding elements of two arrays.
   *
   * @param {Array} arr1 - The first array for comparison.
   * @param {Array} arr2 - The second array for comparison.
   * @returns {number | null} The power of 2 difference if consistent, otherwise null.
   */
  #getDifference = (arr1, arr2) => {
    let result = null;

    for (let i = 0; i < arr1.length; i++) {
      const diff = arr2[i] - arr1[i];
      const isPowerOf2 = isPowerOfTwo(diff);

      if (i == 0) {
        result = isPowerOf2 ? diff : null;
      } else if (result !== diff || !isPowerOf2) {
        return null;
      }
    }
    return result;
  };

  /**
   * #checkAndMergeTerms - Checks and merges terms within groups.
   *
   * @param {Array} groups - The groups to be checked.
   * @returns {Object} An object containing the updated groups and the newly formed group.
   */
  #checkAndMergeTerms = (groups) => {
    let newGroup = [];

    for (let i = 0; i < groups.length - 1; i++) {
      const group1 = groups[i];
      const group2 = groups[i + 1];

      group1.forEach((grp1Element) => {
        let storedDiff = null;

        group2.forEach((grp2Element) => {
          storedDiff = this.#getDifference(
            grp1Element.indexes,
            grp2Element.indexes
          );

          if (Boolean(storedDiff)) {
            grp1Element.used = true;
            grp2Element.used = true;

            let diff = grp1Element.diff
              ? [...grp1Element.diff, storedDiff]
              : [storedDiff];

            let newElement = {
              indexes: [...grp1Element.indexes, ...grp2Element.indexes].sort(
                sortingFn
              ),
              used: false,
              diff: diff.sort(sortingFn),
            };

            let isElementExists = checkElementExistsInArray(
              newElement,
              newGroup
            );

            if (!isElementExists) {
              newGroup[i] = newGroup[i]
                ? [...newGroup[i], newElement]
                : [newElement];
            }
          }
        });
      });
    }
    return { groups, newGroup: newGroup.filter(Boolean) };
  };

  /**
   * simplifyGroups - Recursively simplifies a collection of groups by merging terms.
   *
   * @param {Array} groups - The groups to be simplified.
   * @param {Array} rounds - The result of each simplification round.
   * @returns {Array} An array containing the simplified groups after multiple rounds.
   */
  simplifyGroups = (groups = [], rounds = []) => {
    let newGroup = [];

    if (groups.length <= 1) {
      return [...rounds, groups];
    }

    ({ newGroup, groups } = this.#checkAndMergeTerms(groups));
    rounds = [...rounds, groups];

    if (Boolean(newGroup.length) && newGroup.length >= 1) {
      return this.simplifyGroups(newGroup, rounds);
    } else {
      return rounds;
    }
  };

  /**
   * Finds prime implicants from a given array of groups.
   * Prime implicants are selected elements that have not been used.
   * @param {Array} groups - An array of groups containing potential prime implicants.
   * @returns {Array} - An array of prime implicants.
   */
  findPrimeImplicants = (groups) => {
    return groups
      .reduce((result1, arr1) => {
        return result1.concat(arr1);
      }, [])
      .reduce((result2, arr2) => {
        return result2.concat(arr2);
      }, [])
      .filter((implicant) => implicant.used == false);
  };
};
