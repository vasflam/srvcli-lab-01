export function vector2board(size, vector) {
  const board = Array(size).fill(undefined).map(a => Array(size).fill(undefined));
  for (const move of vector) {
    board[move.y][move.x] = move;
  }
  return board;
};

const transposeMatrix = (matrix) => {
  const transposed = matrix.map((row, i) => matrix.map(row => row[i]));
  return transposed;
};

function getDiagonals(input) {
  var output = new Array(2*input.length-1);
  for (var i= 0 ; i < output.length; ++i) {
    output[i] = [];
    for (var j = Math.min(i, input.length-1); j > Math.max(-1, i-input.length); --j) {
      output[i].push(input[j][i-j]);
    }
  }
  return output;
}

export function getBoardDiagonals(input) {
  const reverse = input.map(row => [...row].reverse());
  const [a, b] = [input, reverse].map(input => {
    return getDiagonals(input);
  });
  return a.concat(b);
};

export function getBoardCombinations(winCount, input) {
  const diagonals = getBoardDiagonals(input);
  const rows = [...input];
  const cols = transposeMatrix(input);
  return rows.concat(cols, diagonals).filter(c => c.length >= winCount);
}
