import React from 'react';
import QuineMcCluskey from './QuineMcCluskey';
import { sortingFn } from './utils';
import Solution from './Solution';

/**
 * Main application component.
 */
const App = () => {
  const [number, setNumber] = React.useState('');
  const [minterms, setMinterms] = React.useState('');
  const [result, setResult] = React.useState('');
  const [rounds, setRounds] = React.useState([]);

  /**
   * Handler for changes in the number input field.
   * @param {Object} e - The event object.
   */
  const onNumberChange = (e) => {
    setNumber(e.target.value);
  };

  /**
   * Handler for changes in the minterms input field.
   * @param {Object} e - The event object.
   */
  const onMintermsChange = (e) => {
    setMinterms(e.target.value);
  };

  /**
   * Handler for the button click event.
   * Creates a QuineMcCluskey instance and calculates the result.
   */
  const onButtonClick = () => {
    // Convert and sort minterm indexes
    let mintermIndexes = minterms.split(',');
    mintermIndexes = mintermIndexes.map((e) => Number(e)).sort(sortingFn);

    // Create QuineMcCluskey instance and calculate result
    const QMInstance = new QuineMcCluskey(number, mintermIndexes);
    setResult(QMInstance.solve());
    setRounds(QMInstance.getRounds());
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
      <div>{result && <Solution result={result} />}</div>
    </>
  );
};

export default App;
