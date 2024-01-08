import React from 'react';
import QuineMcCluskey from './QuineMcCluskey';
import { sortingFn } from './utils';
import Solution from './Solution';
import Rounds from './Rounds';
import MintermTable from './MintermTable';
import { colors } from './utils';
import { Input, Grid, Row, Col, Button } from 'rsuite';
import CheckIcon from '@rsuite/icons/Check';
import ArrowRightIcon from '@rsuite/icons/ArrowRight';

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

    if (value && isValidInput && value >= 1 && value <= 26) {
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
    const value = e;
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
          <h2>Quine-McCluskey method implementation in javascript!</h2>
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
      <Row>
        <Col xs={24}>{rounds && <Rounds rounds={rounds} />}</Col>
      </Row>
      <Row>
        <Col xs={24}>
          <table style={{ margin: '30px 0px' }}>
            <thead>
              <tr>
                <th></th>
                {displayMinterms &&
                  displayMinterms.map((m, i) => <th key={i}>{m}</th>)}
              </tr>
            </thead>
            <tbody>
              {primeImplicants &&
                primeImplicants.map((pi, j) => {
                  let EPI = result.filter((epi) => epi.id == pi.id);

                  return (
                    <tr key={j}>
                      <td
                        style={{
                          textAlign: 'right',
                          paddingRight: '10px',
                        }}
                      >
                        {!!EPI.length && (
                          <span style={{ color: EPI[0].color }}>
                            <ArrowRightIcon style={{ fontSize: '2em' }} />
                          </span>
                        )}
                        {pi.indexes.join(',')}{' '}
                        {pi.diff ? `(${pi.diff.join(',')})` : ''}
                      </td>
                      {displayMinterms.map((m, i) => (
                        <td
                          key={i}
                          style={{
                            border: '1px solid black',
                            width: '40px',
                            height: '40px',
                            textAlign: 'center',
                            background: 'white',
                          }}
                        >
                          {pi.indexes.includes(m) ? (
                            <CheckIcon
                              color='green'
                              style={{ fontSize: '1.5em' }}
                            />
                          ) : (
                            ''
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </Col>
      </Row>
      <Row>
        <Col xs={24}>{result && <Solution result={result} />}</Col>
      </Row>
      <Row>
        <Col xs={24}>
          {result && displayNumber > 1 && displayNumber < 6 && (
            <MintermTable
              variables={displayNumber}
              essentialPIs={result}
              minterms={displayMinterms}
            />
          )}
        </Col>
      </Row>
    </Grid>
  );
};

export default App;
