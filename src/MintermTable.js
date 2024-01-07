import React from 'react';

/**
 * Function to calculate the background color based on the given number and object.
 * @param {number} number - The number for which the background color is to be calculated.
 * @param {Object} numObj - An object containing numbers as keys and arrays of colors as values.
 * @returns {string} - The calculated background color.
 */
const calculateBackgroundColor = (number, numObj) => {
  let background;

  if (numObj.hasOwnProperty(number) && numObj[number].length == 1) {
    background = `${numObj[number][0]}`;
  } else if (numObj.hasOwnProperty(number) && numObj[number].length != 1) {
    let percentage = Math.floor(100 / numObj[number].length);
    let result = '';

    numObj[number].forEach((color, i) => {
      result += `,${color} ${i * percentage}%, ${color} ${
        (i + 1) * percentage
      }%`;
    });
    background = 'linear-gradient(45deg' + result + ')';
  } else {
    background = 'white';
  }

  return background;
};

/**
 * MintermTable component renders a table based on the provided numbers and their associated colors.
 * The table displays numbers and colors for each cell, with a number and a color code.
 *
 * @param {Object} props - Props received by the component.
 * @param {number} props.variables - The number of variables.
 * @param {Object} props.numbers - Object containing the numbers.
 */
const MintermTable = (props) => {
  const { variables, essentialPIs, minterms } = props;
  let showSize = variables == 5 ? [4, 5] : [variables];

  const sizes = {
    2: [
      [0, 1],
      [2, 3],
    ],
    3: [
      [0, 1, 3, 2],
      [4, 5, 7, 6],
    ],
    4: [
      [0, 1, 3, 2],
      [4, 5, 7, 6],
      [12, 13, 15, 14],
      [8, 9, 11, 10],
    ],
    5: [
      [16, 17, 19, 18],
      [20, 21, 23, 22],
      [28, 29, 31, 30],
      [24, 25, 27, 26],
    ],
  };

  let numbers = {};

  minterms.forEach((e) => {
    let colors = [];

    essentialPIs.forEach((epi) => {
      if (epi.indexes.includes(Number(e))) {
        colors.push(epi.color);
      }
    });

    numbers[e] = numbers[e] ? numbers[e].concat(colors) : colors;
  });

  return (
    <>
      {showSize.map((s, k) => (
        <table
          style={{ float: 'left', margin: '10px', marginBottom: '50px' }}
          key={k}
        >
          <tbody>
            {sizes[s].map((row, j) => {
              return (
                <tr key={j}>
                  {row.map((i) => {
                    return (
                      <td
                        key={i}
                        style={{
                          border: '1px solid black',
                          width: '60px',
                          height: '60px',
                          textAlign: 'center',
                          position: 'relative',
                          color: numbers.hasOwnProperty(i) ? 'white' : 'black',
                          background: calculateBackgroundColor(i, numbers),
                        }}
                      >
                        {numbers.hasOwnProperty(i) ? <>1</> : <>0</>}
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '0',
                            right: '2px',
                            fontSize: '0.7em',
                          }}
                        >
                          {i}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      ))}
    </>
  );
};

export default MintermTable;
