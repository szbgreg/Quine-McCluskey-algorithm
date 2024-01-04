import React from 'react';
import QuineMcCluskey from './QuineMcCluskey';
import { sortingFn } from './utils';

const App = () => {
  const [number, setNumber] = React.useState('');
  const [minterms, setMinterms] = React.useState('');
  const [result, setResult] = React.useState('');

  const onNumberChange = (e) => {
    setNumber(e.target.value);
  };

  const onMintermsChange = (e) => {
    setMinterms(e.target.value);
  };

  const onButtonClick = () => {
    let mintermIndexes = minterms.split(',');
    mintermIndexes = mintermIndexes.map((e) => Number(e)).sort(sortingFn);

    const QMInstance = new QuineMcCluskey(number, mintermIndexes);
    setResult(QMInstance.solve());
  };

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
        {result}
      </div>
    </>
  );
};

export default App;
