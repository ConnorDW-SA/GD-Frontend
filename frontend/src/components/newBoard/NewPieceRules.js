// ---------------------- General rules for pieces and game ----------------------

export const isTakingOwnPiece = (board, fromCoordinates, toCoordinates) => {
  const fromPiece = board[fromCoordinates];
  const toPiece = board[toCoordinates];

  if (!fromPiece) {
    return false;
  }

  const isSameColor =
    (fromPiece.toUpperCase() === fromPiece &&
      toPiece &&
      toPiece.toUpperCase() === toPiece) ||
    (fromPiece.toLowerCase() === fromPiece &&
      toPiece &&
      toPiece.toLowerCase() === toPiece);

  return !isSameColor;
};

export const isSameSquare = (fromCoordinates, toCoordinates) => {
  return fromCoordinates === toCoordinates;
};

export const isCorrectTurn = (piece, currentTurn) => {
  const isWhitePiece = piece.toUpperCase() === piece;
  return (
    (isWhitePiece && currentTurn === "white") ||
    (!isWhitePiece && currentTurn === "black")
  );
};

// ---------------------- Pawn Rules ----------------------

export const validPawnMove = (board, fromCoordinates, toCoordinates) => {
  const fromPiece = board[fromCoordinates];
  const toPiece = board[toCoordinates];
  const isWhite = fromPiece.toUpperCase() === fromPiece;

  const fromColumn = fromCoordinates.charCodeAt(0);
  const toColumn = toCoordinates.charCodeAt(0);
  const fromRow = parseInt(fromCoordinates[1]);
  const toRow = parseInt(toCoordinates[1]);

  const forwardDirection = isWhite ? 1 : -1;
  const isCapture =
    toPiece && (fromColumn + 1 === toColumn || fromColumn - 1 === toColumn);

  if (isCapture) {
    return toRow === fromRow + forwardDirection;
  }

  if (fromColumn !== toColumn) {
    return false;
  }

  if (board[`${fromCoordinates[0]}${fromRow + forwardDirection}`]) {
    return false;
  }

  if (toRow === fromRow + forwardDirection) {
    return true;
  }

  const isPawnAtStartingPosition = isWhite ? fromRow === 2 : fromRow === 7;
  if (isPawnAtStartingPosition && toRow === fromRow + forwardDirection * 2) {
    return true;
  }

  return false;
};

// ---------------------- Bishop Rules ----------------------

const isDiagonal = (fromCoordinates, toCoordinates) => {
  const fromColumn = fromCoordinates.charCodeAt(0);
  const toColumn = toCoordinates.charCodeAt(0);
  const fromRow = parseInt(fromCoordinates[1]);
  const toRow = parseInt(toCoordinates[1]);

  return Math.abs(fromColumn - toColumn) === Math.abs(fromRow - toRow);
};

const isPathClear = (board, fromCoordinates, toCoordinates) => {
  const fromColumn = fromCoordinates.charCodeAt(0);
  const toColumn = toCoordinates.charCodeAt(0);
  const fromRow = parseInt(fromCoordinates[1]);
  const toRow = parseInt(toCoordinates[1]);

  const columnIncrement =
    fromColumn === toColumn ? 0 : fromColumn < toColumn ? 1 : -1;
  const rowIncrement = fromRow === toRow ? 0 : fromRow < toRow ? 1 : -1;
  let currentColumn = fromColumn + columnIncrement;
  let currentRow = fromRow + rowIncrement;

  while (
    (columnIncrement !== 0 && currentColumn !== toColumn) ||
    (rowIncrement !== 0 && currentRow !== toRow)
  ) {
    const currentPosition = `${String.fromCharCode(
      currentColumn
    )}${currentRow}`;

    if (board[currentPosition]) {
      return false;
    }

    currentColumn += columnIncrement;
    currentRow += rowIncrement;
  }

  return true;
};

export const validBishopMove = (board, fromCoordinates, toCoordinates) => {
  return (
    isDiagonal(fromCoordinates, toCoordinates) &&
    isPathClear(board, fromCoordinates, toCoordinates)
  );
};

// ---------------------- Knight Rules ----------------------

const isKnightMove = (fromCoordinates, toCoordinates) => {
  const fromColumn = fromCoordinates.charCodeAt(0);
  const toColumn = toCoordinates.charCodeAt(0);
  const fromRow = parseInt(fromCoordinates[1]);
  const toRow = parseInt(toCoordinates[1]);

  const columnDifference = Math.abs(fromColumn - toColumn);
  const rowDifference = Math.abs(fromRow - toRow);

  return (
    (columnDifference === 2 && rowDifference === 1) ||
    (columnDifference === 1 && rowDifference === 2)
  );
};

export const validKnightMove = (fromCoordinates, toCoordinates) => {
  return isKnightMove(fromCoordinates, toCoordinates);
};

// ---------------------- Rook Rules ----------------------

const isHorizontalOrVertical = (fromCoordinates, toCoordinates) => {
  const fromColumn = fromCoordinates.charCodeAt(0);
  const toColumn = toCoordinates.charCodeAt(0);
  const fromRow = parseInt(fromCoordinates[1]);
  const toRow = parseInt(toCoordinates[1]);

  return fromColumn === toColumn || fromRow === toRow;
};

export const validRookMove = (board, fromCoordinates, toCoordinates) => {
  return (
    isHorizontalOrVertical(fromCoordinates, toCoordinates) &&
    isPathClear(board, fromCoordinates, toCoordinates)
  );
};

// ---------------------- Queen Rules ----------------------

export const validQueenMove = (board, fromCoordinates, toCoordinates) => {
  return (
    validBishopMove(board, fromCoordinates, toCoordinates) ||
    validRookMove(board, fromCoordinates, toCoordinates)
  );
};

// ---------------------- Check Rules ----------------------
const isOneSquareMove = (fromCoordinates, toCoordinates) => {
  const fromColumn = fromCoordinates.charCodeAt(0);
  const toColumn = toCoordinates.charCodeAt(0);
  const fromRow = parseInt(fromCoordinates[1]);
  const toRow = parseInt(toCoordinates[1]);

  return Math.abs(fromColumn - toColumn) <= 1 && Math.abs(fromRow - toRow) <= 1;
};

const isCastlingMove = (board, fromCoordinates, toCoordinates, movedPieces) => {
  const fromColumn = fromCoordinates.charCodeAt(0);
  const toColumn = toCoordinates.charCodeAt(0);
  const fromRow = parseInt(fromCoordinates[1]);
  const toRow = parseInt(toCoordinates[1]);

  if (fromRow !== toRow || Math.abs(fromColumn - toColumn) !== 2) {
    return false;
  }

  const isWhite =
    board[fromCoordinates].toUpperCase() === board[fromCoordinates];
  const kingStartPosition = isWhite ? "E1" : "E8";
  const rookStartPosition =
    toColumn < fromColumn ? (isWhite ? "A1" : "A8") : isWhite ? "H1" : "H8";

  if (
    movedPieces.has(kingStartPosition) ||
    movedPieces.has(rookStartPosition)
  ) {
    return false;
  }

  const step = fromColumn < toColumn ? 1 : -1;
  for (
    let column = fromColumn + step;
    column !== rookStartPosition.charCodeAt(0);
    column += step
  ) {
    const currentPosition = `${String.fromCharCode(column)}${fromRow}`;
    if (board[currentPosition]) {
      return false;
    }
  }

  return true;
};

export const validKingMove = (
  board,
  fromCoordinates,
  toCoordinates,
  movedPieces
) => {
  return (
    isOneSquareMove(fromCoordinates, toCoordinates) ||
    isCastlingMove(board, fromCoordinates, toCoordinates, movedPieces)
  );
};

const isAttackingKing = (board, kingPosition, piece, position, movedPieces) => {
  const pieceType = piece.toLowerCase();

  if (pieceType === "p" && validPawnMove(board, position, kingPosition)) {
    return true;
  }

  if (pieceType === "b" && validBishopMove(board, position, kingPosition)) {
    return true;
  }

  if (pieceType === "n" && validKnightMove(position, kingPosition)) {
    return true;
  }

  if (pieceType === "r" && validRookMove(board, position, kingPosition)) {
    return true;
  }

  if (pieceType === "q" && validQueenMove(board, position, kingPosition)) {
    return true;
  }

  if (
    pieceType === "k" &&
    validKingMove(board, position, kingPosition, movedPieces)
  ) {
    return true;
  }

  return false;
};

export const isKingInCheck = (board, currentTurn, movedPieces) => {
  const isWhiteTurn = currentTurn === "white";
  const kingPiece = isWhiteTurn ? "K" : "k";
  const opponentColor = isWhiteTurn ? "black" : "white";

  let kingPosition;

  for (const [position, piece] of Object.entries(board)) {
    if (piece === kingPiece) {
      kingPosition = position;
      break;
    }
  }

  for (const [position, piece] of Object.entries(board)) {
    if (isCorrectTurn(piece, opponentColor)) {
      if (isAttackingKing(board, kingPosition, piece, position, movedPieces)) {
        return true;
      }
    }
  }

  return false;
};

// export const isCheckmate = (board, currentTurn, movedPieces) => {
//     const validMoves = {
//       p: validPawnMove,
//       n: validKnightMove,
//       b: validBishopMove,
//       r: validRookMove,
//       q: validQueenMove,
//       k: validKingMove,
//     };

//     const allSquares = Array.from({ length: 8 }, (_, row) =>
//       Array.from({ length: 8 }, (_, col) =>
//         String.fromCharCode(97 + col) + (row + 1)
//       )
//     ).flat();

//     for (const fromPosition of allSquares) {
//       const piece = board[fromPosition];
//       if (piece && isCorrectTurn(piece, currentTurn)) {
//         const pieceType = piece.toLowerCase();
//         for (const toPosition of allSquares) {
//           if (
//             validMoves[pieceType](board, fromPosition, toPosition, movedPieces)
//           ) {
//             const boardCopy = {
//               ...board,
//               [fromPosition]: "",
//               [toPosition]: piece,
//             };

//             if (!isKingInCheck(boardCopy, currentTurn, movedPieces)) {
//               return false;
//             }
//           }
//         }
//       }
//     }

//     return true;
//   };
