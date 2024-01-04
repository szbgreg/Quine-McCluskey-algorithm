const QuineMcCluskey = require('./QuineMcCluskey.js');

const example_1 = new QuineMcCluskey(
  4,
  [1, 3, 4, 5, 6, 9, 10, 11, 14, 15, 19, 20, 21, 23, 24, 26, 27, 28]
);

const groups = example_1.groupMintermIndexes();
const simplifiedGroups = example_1.simplifyGroups(groups);
let primeImplicants, rows, columns;
let essentialPIs = [];

primeImplicants = example_1.findPrimeImplicants(simplifiedGroups);
primeImplicants = example_1.addIdToPIs(primeImplicants);
rows = example_1.createRows(primeImplicants);
columns = example_1.createColumns(primeImplicants);

console.log(primeImplicants);
console.log(rows);
console.log(columns);

const extractAllEPIs = (rows, columns, essentialPIs = []) => {
  let extractedEPIs = example_1.extractEPIs(columns);

  if (extractedEPIs.length != 0) {
    essentialPIs = essentialPIs.concat(extractedEPIs);
    console.log('------ EXTRACTED EPIs ------');
    console.log(extractedEPIs);
    // Remove extracted EPIs from PIs table
    ({ rows, columns } = example_1.removeFromTable(
      rows,
      columns,
      extractedEPIs
    ));

    console.log('------ AFTER EPI EXTRACTED ------');
    console.log(columns);
    console.log(rows);
    return extractAllEPIs(rows, columns, essentialPIs);
  }

  // Check row dominance
  let dominatedRows = example_1.checkRowDominance(rows);

  if (dominatedRows.length != 0) {
    console.log('------ DOMINATED ROWS ------');
    console.log(dominatedRows);
    // Remove dominated rows, and their label from columns
    rows = example_1.eliminateRows(rows, dominatedRows);
    columns = example_1.removeRowIds(columns, dominatedRows);

    console.log('------ AFTER ROW ELIMINATE ------');
    console.log(columns);
    console.log(rows);
    return extractAllEPIs(rows, columns, essentialPIs);
  }

  // Check column dominance
  let dominating = example_1.checkColDominance(columns);
  if (dominating.length != 0) {
    console.log('------ DOMINATING COLUMNS ------');
    console.log(dominating);
    // Remove dominating columns, and their label from rows
    columns = example_1.eliminateCols(columns, dominating);
    rows = example_1.removeColIds(rows, dominating);

    console.log('------ AFTER COLUMN ELIMINATE ------');
    console.log(columns);
    console.log(rows);
    return extractAllEPIs(rows, columns, essentialPIs);
  }

  // If there is no dominated row and dominating column, choose the PI with the most indexes
  if (rows.length != 0) {
    let row = example_1.findRowWithMostColIds(rows);
    console.log('------ ROW WITH MOST COLIDS ------');
    console.log(row.label);
    essentialPIs = essentialPIs.concat([row.label]);

    // Remove row from table
    ({ rows, columns } = example_1.removeFromTable(rows, columns, [row.label]));

    console.log('------ AFTER REMOVE ROW WITH MOST COLDS ------');
    console.log(columns);
    console.log(rows);
    return extractAllEPIs(rows, columns, essentialPIs);
  }
  return essentialPIs;
};

essentialPIs = extractAllEPIs(rows, columns);

console.log(essentialPIs);
