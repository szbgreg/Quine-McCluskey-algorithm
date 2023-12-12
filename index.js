const QuineMcCluskey = require('./QuineMcCluskey.js');

const example_1 = new QuineMcCluskey(
  4,
  [1, 3, 4, 5, 6, 9, 10, 11, 14, 15, 19, 20, 21, 23, 24, 26, 27, 28]
);

example_1.groupMintermIndexes().forEach((e) => console.log(e));
