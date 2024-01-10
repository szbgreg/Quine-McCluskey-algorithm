import React from 'react';
import QuineMcCluskey from './QuineMcCluskey';
import { sortingFn } from './utils';
import Solution from './Solution';
import Rounds from './Rounds';
import MintermTable from './MintermTable';
import { colors } from './utils';
import { Input, Grid, Row, Col, Button } from 'rsuite';
import PrimeImplicantTable from './PrimeImplicantTable';

/**
 * Main application component.
 */
const App = () => {
  const [number, setNumber] = React.useState('');
  const [minterms, setMinterms] = React.useState('');
  const [result, setResult] = React.useState(null);
  const [rounds, setRounds] = React.useState(undefined);
  const [displayNumber, setDisplayNumber] = React.useState('');
  const [displayMinterms, setDisplayMinterms] = React.useState([]);
  const [primeImplicants, setPrimeImplicants] = React.useState([]);

  /**
   * Handler for changes in the number input field.
   * The input field only accepts numbers greater than zero.
   * @param {Object} e - The event object.
   */
  const onNumberChange = (e) => {
    const value = e;
    const isValidInput = /^[1-9][0-9]*$/.test(value);

    if ((value && isValidInput && value >= 1 && value <= 26) || value === '') {
      setNumber(value);
    }
  };

  /**
   * Handler for changes in the minterms input field.
   * The input field only accepts numbers, comma and space.
   * @param {Object} e - The event object.
   */
  const onMintermsChange = (e) => {
    const value = e;
    const isValidInput = /^[0-9,]+$/.test(value);

    if ((value && isValidInput) || value === '') {
      setMinterms(value);
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
        .filter(Boolean)
        .map((e) => Number(e))
        .sort(sortingFn);

      maxIndex = mintermIndexes.length - 1;
      maxNumber = mintermIndexes[maxIndex];

      if (Math.log2(maxNumber) < number) {
        // Create QuineMcCluskey instance and calculate result
        const QMInstance = new QuineMcCluskey(number, mintermIndexes);

        let essentialPIs = QMInstance.solve().map((e, i) => {
          return { ...e, color: colors[i] };
        });
        let PIs = QMInstance.getPrimeImplicants();

        setPrimeImplicants(PIs);
        setResult(essentialPIs);
        setRounds(QMInstance.getRounds());
        setDisplayNumber(number);
        setDisplayMinterms(mintermIndexes);
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
    <Grid>
      <Row style={{ marginTop: '50px' }}>
        <Col xs={24}>
          <h2>Quine-McCluskey method implementation in JavaScript!</h2>
        </Col>
      </Row>
      <Row style={{ marginTop: '30px' }}>
        <Col xs={24}>
          <label htmlFor='minterms'>Minterms</label>
          <Input
            type='text'
            id='minterms'
            onChange={onMintermsChange}
            value={minterms}
            placeholder={
              'Please give the minterms here seperated by comma. e.g: 1,2,3,4,5'
            }
          />
        </Col>
      </Row>

      <Row>
        <Col xs={24}>
          <label htmlFor='numberOfVariables'>Number of variables</label>
          <Input
            type='number'
            id='numberOfVariables'
            onChange={onNumberChange}
            value={number}
            placeholder='Enter a number representing the variable count (must be between 1 and 26)'
          />
        </Col>
      </Row>

      <Row style={{ marginTop: '10px' }}>
        <Col xs={24}>
          <Button
            appearance='primary'
            color='green'
            onClick={onButtonClick}
            block
          >
            <span
              style={{
                fontWeight: 'bold',
                letterSpacing: '2px',
                fontSize: '1rem',
              }}
            >
              Solve
            </span>
          </Button>
        </Col>
      </Row>
      {rounds && (
        <Row style={{ margin: '20px auto' }}>
          <Col xs={24}>
            <Rounds rounds={rounds} />
          </Col>
        </Row>
      )}
      {displayMinterms && result && (
        <Row style={{ margin: '20px auto' }}>
          <Col xs={24}>
            <PrimeImplicantTable
              result={result}
              primeImplicants={primeImplicants}
              displayMinterms={displayMinterms}
            />
          </Col>
        </Row>
      )}
      {result && (
        <Row style={{ margin: '20px auto' }}>
          <Col xs={24}>{result && <Solution result={result} />}</Col>
        </Row>
      )}

      {result && displayNumber > 1 && displayNumber < 6 && (
        <Row>
          <Col xs={24}>
            <MintermTable
              variables={displayNumber}
              essentialPIs={result}
              minterms={displayMinterms}
            />
          </Col>
        </Row>
      )}
    </Grid>
  );
};

export default App;
