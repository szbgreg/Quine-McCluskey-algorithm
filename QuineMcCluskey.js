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
};
