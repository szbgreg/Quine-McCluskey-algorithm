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
  const mintermsWithColors = {
    1: ['blue'],
    2: ['red'],
    3: ['red', 'blue'],
    4: ['green'],
    5: ['blue', 'green'],
    6: ['red', 'green'],
    7: ['red', 'blue', 'green'],
    9: ['blue'],
    11: ['blue'],
    12: ['green'],
    13: ['blue', 'green'],
    14: ['green'],
    15: ['blue', 'green'],
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
        {result && number > 1 && number < 6 && (
          <MintermTable variables={number} numbers={mintermsWithColors} />
        )}
      </div>
    </>
  );
};

export default App;
