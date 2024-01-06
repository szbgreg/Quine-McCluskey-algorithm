import React from 'react';
import CheckIcon from '@rsuite/icons/Check';
import CloseIcon from '@rsuite/icons/Close';

/**
 * Component to display round.
 */
const Round = (props) => {
  const { round } = props;

  return (
    <>
      {round.map((groups, i) => {
        return (
          <div key={i}>
            <Groups groups={groups} />
            {i < round.length - 1 && <hr style={{ width: '50%' }} />}
          </div>
        );
      })}
    </>
  );
};

/**
 * Component to display groups.
 */
const Groups = (props) => {
  const { groups } = props;

  return (
    <ul>
      {groups.map((group, i) => (
        <li
          style={{
            listStyle: 'none',
          }}
          key={i}
        >
          {group.indexes.join(',')}
          <span style={{ paddingRight: '10px' }}>
            {group.diff && <> ({group.diff.join(',')})</>}
          </span>
          {!!group.used ? (
            <span>
              {' '}
              <CheckIcon style={{ fontSize: '1.2em' }} color='green' />
            </span>
          ) : (
            <span>
              {' '}
              <CloseIcon style={{ fontSize: '1.2em' }} color='red' />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
};

/**
 * Component to display group states during each round.
 */
const Rounds = (props) => {
  const { rounds } = props;

  return (
    <div style={{ display: 'inline-block', width: '100vh' }}>
      {rounds.map((round, i) => {
        return (
          <div
            key={i}
            style={{
              float: 'left',
            }}
          >
            <Round round={round} />
          </div>
        );
      })}
    </div>
  );
};

export default Rounds;
