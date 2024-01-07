import React from 'react';

/**
 * Formats the given expression.
 * @param {string} expression - The expression to be formatted.
 * @returns {Array} An array containing the formatted characters.
 */
const formatExpression = (expression) => {
  return expression.split('').map((char, index) => {
    switch (char) {
      case '-':
        break;
      case '0':
        return (
          <span key={index} style={{ textDecoration: 'overline' }}>
            {String.fromCharCode(65 + index)}
          </span>
        );

      default:
        return String.fromCharCode(65 + index);
    }
  });
};

/**
 * Component to display solution.
 */
const Solution = (props) => {
  const { result } = props;

  return (
    <p style={{ marginTop: '20px', marginBottom: '30px' }}>
      Possible solution is{' '}
      <span style={{ fontWeight: 'bold' }}>
        {result.map((e, i) => {
          return (
            <React.Fragment key={i}>
              <span style={{ color: e.color }}>
                {formatExpression(e.binaryForm)}{' '}
              </span>
              {result.length - 1 != i ? <> {'+'} </> : false}
            </React.Fragment>
          );
        })}
      </span>
      .
    </p>
  );
};

export default Solution;
