const {
  checkElementExistsInArray,
  countOnesInBinary,
  isDominated,
  isPowerOfTwo,
  sortingFn,
  toBinary,
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
  #groupMintermIndexes = () => {
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
   * #simplifyGroups - Recursively simplifies a collection of groups by merging terms.
   *
   * @param {Array} groups - The groups to be simplified.
   * @param {Array} rounds - The result of each simplification round.
   * @returns {Array} An array containing the simplified groups after multiple rounds.
   */
  #simplifyGroups = (groups = [], rounds = []) => {
    let newGroup = [];

    if (groups.length <= 1) {
      return [...rounds, groups];
    }

    ({ newGroup, groups } = this.#checkAndMergeTerms(groups));
    rounds = [...rounds, groups];

    if (Boolean(newGroup.length) && newGroup.length >= 1) {
      return this.#simplifyGroups(newGroup, rounds);
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
  #findPrimeImplicants = (groups) => {
    return groups
      .reduce((result1, arr1) => {
        return result1.concat(arr1);
      }, [])
      .reduce((result2, arr2) => {
        return result2.concat(arr2);
      }, [])
      .filter((implicant) => implicant.used == false);
  };

  /**
   * The function adds 'id' to each prime implicant.
   * The identifier is created with the prefix "P" followed by the index of the prime implicant.
   * @param {Array} primeImplicants - Array of prime implicants.
   * @returns {Array} - Array of prime implicants with unique identifiers added.
   */
  #addIdToPIs = (primeImplicants) => {
    return primeImplicants.map((i, index) => {
      return { id: `p${index + 1}`, ...i };
    });
  };

  /**
   * Transforms prime implicants into row objects.
   * @param {Array} primeImplicants - Array of prime implicants.
   * @returns {Array} - Array of row objects.
   */
  #createRows = (primeImplicants) => {
    return primeImplicants.map((i) => {
      return { label: i.id, colIds: i.indexes };
    });
  };

  /**
   * Group prime implicants by their minterm indexes.
   * @param {Array} primeImplicants - Array of prime implicants.
   * @returns {Object} - Object where keys are minterm indexes and values are arrays of prime implicant IDs.
   */
  #groupPIsByIndexes = (primeImplicants) => {
    let resultObj = {};

    primeImplicants.forEach((item) => {
      item.indexes.forEach((index) => {
        if (!resultObj[index]) {
          resultObj[index] = [];
        }
        resultObj[index].push(item.id);
      });
    });

    return resultObj;
  };

  /**
   * The function creates columns for the prime implicant table.
   *
   * @param {Array} primeImplicants - Array of prime implicants.
   * @returns {Array} - Array of column objects.
   */
  #createColumns = (primeImplicants) => {
    let numbers = this.#groupPIsByIndexes(primeImplicants);

    // Convert the grouped data into column objects
    return Object.keys(numbers).map((index) => ({
      label: Number(index),
      rowIds: numbers[index],
    }));
  };

  /**
   * The function extracts Essential Prime Implicants (EPIs).
   * @param {Array} columns - Array of column objects, each containing row identifiers.
   * @returns {Array} - Array of prime implicant IDs representing the Essential Prime Implicants (EPIs).
   */
  #extractEPIs = (columns) => {
    let result = new Set();

    columns.forEach((r) => {
      if (r.rowIds.length == 1) {
        r.rowIds.forEach((id) => result.add(id));
      }
    });

    return Array.from(result);
  };

  /**
   * The function eliminates columns from an array.
   * It filters out columns whose label matches any of the provided excludeIds.
   *
   * @param {Array} columns - Array of column objects.
   * @param {Array} excludeIds - Array of identifiers to be excluded.
   * @returns {Array} - Filtered array of column objects.
   */
  #eliminateCols = (columns, excludeIds) => {
    return columns.filter((c) => !excludeIds.includes(c.label));
  };

  /**
   * The function filters out the excluded ids from each row's colIds array.
   * Rows with an empty colIds array are also filtered out.
   *
   * @param {Array} rows - Array of row objects.
   * @param {Array} excludeIds - Array of ids to be removed from colIds.
   * @returns {Array} - Array of row objects with updated colIds, excluding rows with the provided ids.
   */
  #removeColIds = (rows, excludeIds) => {
    return rows
      .map((c) => {
        return {
          ...c,
          colIds: c.colIds.filter((id) => !excludeIds.includes(id)),
        };
      })
      .filter((r) => Boolean(r.colIds.length));
  };

  /**
   * The function removes specific columns and their associated rows from a table based on given labels.
   * It identifies columns and their associated row identifiers based on the provided label array (arr),
   * and then eliminates these columns and updates the rows accordingly.
   *
   * @param {Array} rows - Array of row objects.
   * @param {Array} columns - Array of column objects.
   * @param {Array} labels - Array of labels to identify which columns and rows to remove.
   * @returns {Object} - An object containing the updated rows and columns arrays after removal.
   */
  #removeFromTable = (rows, columns, labels) => {
    let numbers = new Set();

    // Iterate through rows to collect column identifiers based on labels in arr
    rows.forEach((e) => {
      if (labels.includes(e.label)) {
        e.colIds.forEach((id) => numbers.add(id));
      }
    });

    numbers = Array.from(numbers);

    // Eliminate columns and update rows based on collected identifiers
    columns = this.#eliminateCols(columns, numbers);
    rows = this.#removeColIds(rows, numbers);

    return { rows, columns };
  };

  /**
   * Checks the dominance of rows based on their colIds.
   * @param {Array} rows - Array of objects representing rows.
   * @returns {Array} - An array of labels that are dominated by others.
   */
  #checkRowDominance = (rows) => {
    let dominated = new Set();

    for (let i = rows.length - 1; i >= 0; i--) {
      for (let j = 0; j < rows.length; j++) {
        if (
          i !== j &&
          !dominated.has(rows[j].label) &&
          isDominated(rows[i].colIds, rows[j].colIds)
        ) {
          dominated.add(rows[i].label);
        }
      }
    }
    return Array.from(dominated);
  };

  /**
   * Eliminates rows from the given array based on excludeIds.
   * @param {Array} rows - Array of objects representing rows.
   * @param {Array} excludeIds - Array of row labels to be excluded.
   * @returns {Array} - A new array of rows.
   */
  #eliminateRows = (rows, excludeIds) => {
    return rows.filter((r) => !excludeIds.includes(r.label));
  };

  /**
   * Removes specific rowIds from each column object based on excludeIds.
   * @param {Array} columns - Array of column objects.
   * @param {Array} excludeIds - Array of rowIds to be excluded from the columns.
   * @returns {Array} - A new array of column objects with filtered rowIds.
   */
  #removeRowIds = (columns, excludeIds) => {
    return columns
      .map((c) => {
        return {
          ...c,
          rowIds: c.rowIds.filter((id) => !excludeIds.includes(id)),
        };
      })
      .filter((r) => Boolean(r.rowIds.length));
  };

  /**
   * Checks the dominance of columns based on their rowIds.
   * @param {Array} columns - Array of column objects, each containing rowIds.
   * @returns {Array} - An array of labels that dominate others based on rowIds.
   */
  #checkColDominance = (columns) => {
    let dominating = new Set();

    for (let i = 0; i < columns.length; i++) {
      for (let j = 0; j < columns.length; j++) {
        if (
          j != i &&
          !dominating.has(columns[i].label) &&
          isDominated(columns[i].rowIds, columns[j].rowIds)
        ) {
          dominating.add(columns[j].label);
        }
      }
    }
    return Array.from(dominating);
  };

  /**
   * Finds the row object with the maximum number of elements in its colIds array.
   * @param {Array} rows - Array of objects representing rows.
   * @returns {Object|null} - The row object with the maximum colIds or null if the array is empty.
   */
  #findRowWithMostColIds = (rows) => {
    let maxCount = 0;
    let maxObj = null;

    for (const obj of rows) {
      if (obj.colIds.length > maxCount) {
        maxCount = obj.colIds.length;
        maxObj = obj;
      }
    }

    return maxObj;
  };

  /**
   * Extracts Essential Prime Implicants.
   * @param {Array} rows - Array of objects representing rows.
   * @param {Array} columns - Array of objects representing columns.
   * @param {Array} [essentialPIs=[]] - An optional array to accumulate essential PIs.
   * @returns {Array} - An array containing the extracted essential PIs.
   */
  #extractAllEPIs = (rows, columns, essentialPIs = []) => {
    let extractedEPIs = this.#extractEPIs(columns);

    if (extractedEPIs.length != 0) {
      essentialPIs = essentialPIs.concat(extractedEPIs);
      // Remove extracted EPIs from PIs table
      ({ rows, columns } = this.#removeFromTable(rows, columns, extractedEPIs));
      return this.#extractAllEPIs(rows, columns, essentialPIs);
    }

    // Check row dominance
    let dominatedRows = this.#checkRowDominance(rows);

    if (dominatedRows.length != 0) {
      // Remove dominated rows, and their label from columns
      rows = this.#eliminateRows(rows, dominatedRows);
      columns = this.#removeRowIds(columns, dominatedRows);
      return this.#extractAllEPIs(rows, columns, essentialPIs);
    }

    // Check column dominance
    let dominating = this.#checkColDominance(columns);
    if (dominating.length != 0) {
      // Remove dominating columns, and their label from rows
      columns = this.#eliminateCols(columns, dominating);
      rows = this.#removeColIds(rows, dominating);
      return this.#extractAllEPIs(rows, columns, essentialPIs);
    }

    // If there is no dominated row and dominating column, choose the PI with the most indexes
    if (rows.length != 0) {
      let row = this.#findRowWithMostColIds(rows);
      essentialPIs = essentialPIs.concat([row.label]);
      ({ rows, columns } = this.#removeFromTable(rows, columns, [row.label]));
      return this.#extractAllEPIs(rows, columns, essentialPIs);
    }
    return essentialPIs;
  };

  #convertToBinaryRep = (primeImplicants, essentialPIs) => {
    return primeImplicants
      .map((i) => {
        if (essentialPIs.includes(i.id)) {
          let binary = toBinary(i.indexes[0], this.variablesCount);
          binary = binary.split('').reverse();
          if (i.diff && i.diff.length) {
            i.diff.forEach((e) => (binary[Math.log2(e)] = '-'));
          }
          return binary.reverse().join('');
        }
      })
      .filter(Boolean);
  };

  /**
   * Solves the given set of minterm indexes to determine the minimized Boolean expression.
   * @returns {Array} - An array of strings representing the minimized Boolean expression.
   */
  solve = () => {
    const groups = this.#groupMintermIndexes();
    const simplifiedGroups = this.#simplifyGroups(groups);
    let primeImplicants, rows, columns, result;
    let essentialPIs = [];

    primeImplicants = this.#findPrimeImplicants(simplifiedGroups);
    primeImplicants = this.#addIdToPIs(primeImplicants);
    rows = this.#createRows(primeImplicants);
    columns = this.#createColumns(primeImplicants);

    essentialPIs = this.#extractAllEPIs(rows, columns);

    result = this.#convertToBinaryRep(primeImplicants, essentialPIs);

    return result;
  };
};
