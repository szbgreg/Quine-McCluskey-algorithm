import React from 'react';
import CheckIcon from '@rsuite/icons/Check';
import ArrowRightIcon from '@rsuite/icons/ArrowRight';

/** Display PrimeImplicant table */
const PrimeImplicantTable = (props) => {
  const { displayMinterms, primeImplicants, result } = props;

  return (
    <>
      <h4 style={{ marginBottom: '10px' }}>Prime Implicant Table</h4>
      <table>
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
    </>
  );
};

export default PrimeImplicantTable;
