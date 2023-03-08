import { useState } from 'react';
import './style.css';

/**
 * Generate board for `size` and fill moves
 */
const generateBoard = (firstUser, size, moves) => {
  const data = [];
  for (let y = 0; y < size; y++) {
    const row = [];
    for (let x = 0; x < size; x++) {
      row.push({x, y, synthetic: true, sym: ''});
    }
    data.push(row);
  }

  moves.forEach(move => {
    const {x, y, user_id} = move;
    data[y][x] = {
      ...move,
      sym: firstUser == move.user_id ? 'x' : 'o',
    };
  });

  return data;
}

function GameBoardCell({ move, completed, makeMove, canMove, mySymbol, isWinnedMove }) {
  const { x, y } = move;
  const [symbol, setSymbol] = useState(move.sym);
  const [beforeHoverSymbol, setBeforeHoverSymbol] = useState('');
  const click = () => {
    if (completed) {
      return;
    }

    if (canMove && symbol == '') {
      setSymbol(mySymbol);
      makeMove(x, y);
    }
  };

  const onMouseOver = (event) => {
    if (canMove && symbol == '') {
      setBeforeHoverSymbol(mySymbol);
    }
  };

  const onMouseOut = (event) => {
    if (beforeHoverSymbol != '') {
      setBeforeHoverSymbol('');
    }
  };

  const className = [
    'game-board-cell',
    symbol != '' ? 'filled' : '',
    isWinnedMove ? 'winned-move' : '',
  ].join(' ');

  return (
    <td
      className={className}
      x={move.x}
      y={move.y}
      onClick={click}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      {beforeHoverSymbol != '' ? beforeHoverSymbol : symbol}
    </td>
  );
}

function GameBoardRow({ moves, winnedMoves, completed, makeMove, canMove, mySymbol }) {
  return (
    <tr className="game-board-row" >
      {moves.map((move) => {
        const isWinnedMove = !!winnedMoves.filter(id => id == move.id).length;
        const {x, y, sym, user_id} = move;
        const key = sym == '' ? `cell-${y}-${x}` : `cell-${y}-${x}-${user_id}`;
        const props = {
          move,
          makeMove,
          canMove,
          key,
          mySymbol,
          completed,
          isWinnedMove,
        };
        return <GameBoardCell {...props} />
      })}
    </tr>
  );
}

/**
 * GameBoard
 */
export function GameBoard(props) {
  const { game, moves, completed, canMove, isFirst, handleMove } = props;
  const { winnedMoves } = game;
  const data = generateBoard(game.first, game.size, moves);
  const mySymbol = isFirst ? 'x' : 'o';
  const makeMove = (x, y) => {
    if (canMove) {
      handleMove(x, y);
    }
  };

  const table = data.map((moves, y) => {
    const props = {
      key: `row-${y}`,
      moves,
      makeMove,
      canMove,
      mySymbol,
      completed,
      winnedMoves,
    };
    return <GameBoardRow {...props} />
  });

  const className = [
    'game-board',
    canMove ? 'your-turn' : '',
    isFirst ? 'is-first': '',
    `my-symbol-${mySymbol}`,
    completed ? 'game-completed' : '',
  ].join(' ');

  return (
    <table className={className} style={{ borderCollapse: 'collapse' }}>
      <tbody>{table}</tbody>
    </table>
  );
}
