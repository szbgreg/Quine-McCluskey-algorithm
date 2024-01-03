const QuineMcCluskey = require('./QuineMcCluskey.js');

const example_1 = new QuineMcCluskey(
  4,
  [1, 3, 4, 5, 6, 9, 10, 11, 14, 15, 19, 20, 21, 23, 24, 26, 27, 28]
);

const groups = example_1.groupMintermIndexes();
const simplifiedGroups = example_1.simplifyGroups(groups);
let primeImplicants, rows, columns, extractedEPIs;

primeImplicants = example_1.findPrimeImplicants(simplifiedGroups);
primeImplicants = example_1.addIdToPIs(primeImplicants);
rows = example_1.createRows(primeImplicants);
columns = example_1.createColumns(primeImplicants);
extractedEPIs = example_1.extractEPIs(columns);

console.log(primeImplicants);
console.log(rows);
console.log(columns);
console.log(extractedEPIs);
