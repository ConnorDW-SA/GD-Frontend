/* 
By default lastMove is null
*/

let lastMove = null;

/* 
Helper function for moving up and down
*/

export const isVerticalMove = (source, destination) => {
  return source[0] === destination[0];
};

/* 
Helper function for moving sideways
*/

export const isHorizontalMove = (source, destination) => {
  return source[1] === destination[1];
};

/* 
Helper function for moving diagonally
*/

export const isDiagonalMove = (source, destination) => {
  return (
    Math.abs(
      source.position.charCodeAt(0) - destination.position.charCodeAt(0)
    ) ===
    Math.abs(parseInt(source.position[1]) - parseInt(destination.position[1]))
  );
};

/* 
Helper function for stopping pieces taking their own pieces
*/

export const isSameColorPiece = (sourceSquare, destinationSquare) => {
  if (destinationSquare.piece === null) {
    return false;
  }
  return sourceSquare.piece.color === destinationSquare.piece.color;
};

/* 
Helper function for determining if the squares betwen pieces is occupied.
Useful for every piece except king and knight as king can only move 1 square at all times
and knights can move over other pieces (pawns can move 2 squares on first turn)
*/

export const isMoveObstructed = (
  sourceSquare,
  destinationSquare,
  chessBoard,
  direction
) => {
  const [sourceRow, sourceCol] = getRowAndCol(sourceSquare.position);
  const [destRow, destCol] = getRowAndCol(destinationSquare.position);

  const rowDirection = destRow > sourceRow ? 1 : destRow < sourceRow ? -1 : 0;
  const colDirection = destCol > sourceCol ? 1 : destCol < sourceCol ? -1 : 0;

  let currentRow = sourceRow + rowDirection;
  let currentCol = sourceCol + colDirection;

  while (currentRow !== destRow || currentCol !== destCol) {
    const currentSquare = chessBoard[currentRow][currentCol];
    if (currentSquare.piece) {
      return true;
    }

    currentRow += rowDirection;
    currentCol += colDirection;
  }

  return false;
};

const getRowAndCol = (position) => {
  const row = 8 - parseInt(position[1]);
  const col = position.charCodeAt(0) - "a".charCodeAt(0);
  return [row, col];
};

/* 
Helper function for logging the last move made, to supply proper chess notation
*/

export const logPieceMove = (sourceSquare, destinationSquare) => {
  console.log(
    sourceSquare.piece.color,
    sourceSquare.piece.type,
    "moved from",
    sourceSquare.position,
    "to",
    destinationSquare.position
  );
  lastMove = {
    from: sourceSquare.position,
    to: destinationSquare.position,
    piece: sourceSquare.piece,
    isPawnDoubleMove:
      sourceSquare.piece.type === "pawn" &&
      Math.abs(destinationSquare.position[1] - sourceSquare.position[1]) === 2
  };
};

export const getLastMove = () => {
  return lastMove;
};

/* 
Helper function for removing a piece from the board after a successful en passant move
*/

export const removePiece = (position, chessBoard) => {
  const newBoard = chessBoard.map((row) => {
    return row.map((square) => {
      if (square.position === position) {
        return { ...square, piece: null };
      } else {
        return square;
      }
    });
  });
  return newBoard;
};
