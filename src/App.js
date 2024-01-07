import React from 'react';
import QuineMcCluskey from './QuineMcCluskey';
import { sortingFn } from './utils';
import Solution from './Solution';
import Rounds from './Rounds';
import MintermTable from './MintermTable';

/**
 * Main application component.
 */
const App = () => {
  const [number, setNumber] = React.useState('');
  const [minterms, setMinterms] = React.useState('');
  const [result, setResult] = React.useState('');
  const [rounds, setRounds] = React.useState(undefined);
  const [displayNumber, setDisplayNumber] = React.useState('');

  const colors = [
    '#00A1F1',
    '#F65314',
    '#7CBB00',
    '#FFBB00',
    '#8b6bc7',
    '#1F305E',
    '#B31B1B',
    '#29AB87',
    '#66023C',
    '#b36b00',
    '#006080',
    '#ACE1AF',
    '#F3E5AB',
    '#808000',
    '#8B8589',
    '#1560BD',
    '#6050DC',
    '#DF73FF',
    '#997A8D',
    '#C19A6B',
    '#4F7942',
    '#0000FF',
    '#FF0800',
    '#03C03C',
  ];

  const mintermsWithColors = {
    0: [colors[0]],
    1: [colors[1]],
    2: [colors[2]],
    3: [colors[3]],
    4: [colors[4]],
    5: [colors[5]],
    6: [colors[6]],
    7: [colors[7]],
    8: [colors[8]],
    9: [colors[9]],
    10: [colors[10]],
    11: [colors[11]],
    12: [colors[12]],
    13: [colors[13]],
    14: [colors[14]],
    15: [colors[15]],
    16: [colors[16]],
    17: [colors[17]],
    18: [colors[18]],
    19: [colors[19]],
    20: [colors[20]],
    21: [colors[21]],
    22: [colors[22]],
    23: [colors[23]],
  };

  /**
   * Handler for changes in the number input field.
   * The input field only accepts numbers greater than zero.
   * @param {Object} e - The event object.
   */
  const onNumberChange = (e) => {
    const value = e.target.value;
    const isValidInput = /^[1-9][0-9]*$/.test(value);

    if (value && isValidInput) {
      setNumber(value);
    } else {
      setNumber('');
    }
  };

  /**
   * Handler for changes in the minterms input field.
   * The input field only accepts numbers, comma and space.
   * @param {Object} e - The event object.
   */
  const onMintermsChange = (e) => {
    const value = e.target.value;
    const isValidInput = /^[0-9,-\s]*$/.test(value);

    if (value && isValidInput) {
      setMinterms(value);
    } else {
      setMinterms('');
    }
  };

  /**
   * Handler for the button click event.
   * Creates a QuineMcCluskey instance and calculates the result.
   */
  const onButtonClick = () => {
    if (number && minterms) {
      let maxIndex, maxNumber, mintermIndexes;

      // Convert and sort minterm indexes
      mintermIndexes = minterms.split(',');
      mintermIndexes = mintermIndexes
        .map((e) => Number(e))
        .sort(sortingFn)
        .filter(Boolean);

      maxIndex = mintermIndexes.length - 1;
      maxNumber = mintermIndexes[maxIndex];

      if (Math.log2(maxNumber) < number) {
        // Create QuineMcCluskey instance and calculate result
        const QMInstance = new QuineMcCluskey(number, mintermIndexes);

        setResult(QMInstance.solve());
        setRounds(QMInstance.getRounds());
        setDisplayNumber(number);
      } else {
        alert(
          'The number of variables is too small for these minterm indexes.'
        );
      }
    } else {
      alert('Please enter valid data in the input fields.');
    }
  };

  // Render the component
  return (
    <>
      <div>
        <label htmlFor='minterms'>Minterms</label>
        <input
          type='text'
          id='minterms'
          onChange={onMintermsChange}
          value={minterms}
        />
        <label htmlFor='numberOfVariables'>Number of variables</label>
        <input
          type='number'
          id='numberOfVariables'
          onChange={onNumberChange}
          value={number}
        />
        <input type='button' onClick={onButtonClick} value={'Solve'} />
      </div>
      <div>{rounds && <Rounds rounds={rounds} />}</div>
      <div>{result && <Solution result={result} />}</div>
      <div>
        {result && displayNumber > 1 && displayNumber < 6 && (
          <MintermTable
            variables={displayNumber}
            numbers={mintermsWithColors}
          />
        )}
      </div>
    </>
  );
};

export default App;
