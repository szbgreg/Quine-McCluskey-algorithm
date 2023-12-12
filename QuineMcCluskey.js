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
      const count = index.toString(2).split('1').length - 1;
      const newElement = { indexes: [index], used: false, diff: null };

      groups[count] = groups[count]
        ? [...groups[count], newElement]
        : [newElement];
    });

    // Remove groups without elements
    return groups.filter(Boolean);
  };
};
