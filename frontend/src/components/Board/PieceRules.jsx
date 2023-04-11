// ---------------------------------------------- PAWN MOVE LOGIC ----------------------------------------------
export const validPawnMove = (board, startX, startY, endX, endY, player) => {
  const forwardDirection = player === "white" ? -1 : 1;
  const startingRow = player === "white" ? 6 : 1;
  const endingRow = player === "white" ? 0 : 7;
  const maxStartingMove = startingRow + forwardDirection * 2;

  if (
    endX === startX + forwardDirection &&
    endY === startY &&
    board[endX][endY] === ""
  ) {
    return true;
  } else if (
    endX === startX + forwardDirection &&
    Math.abs(endY - startY) === 1 &&
    board[endX][endY] !== "" &&
    board[endX][endY].toLowerCase() !== player
  ) {
    return true;
  } else if (
    endX === startX + forwardDirection * 2 &&
    endY === startY &&
    startX === startingRow &&
    board[endX][endY] === "" &&
    board[startX + forwardDirection][endY] === ""
  ) {
    return true;
  }

  return false;
};

// ---------------------------------------------- BISHOP MOVE LOGIC ----------------------------------------------

export const validBishopMove = (
  board,
  startX,
  startY,
  targetX,
  targetY,
  playerColor
) => {
  const deltaX = Math.abs(targetX - startX);
  const deltaY = Math.abs(targetY - startY);

  if (deltaX !== deltaY) {
    return false;
  }

  const directionX = startX < targetX ? 1 : -1;
  const directionY = startY < targetY ? 1 : -1;

  let currentX = startX + directionX;
  let currentY = startY + directionY;

  while (
    currentX >= 0 &&
    currentX < 8 &&
    currentY >= 0 &&
    currentY < 8 &&
    (currentX !== targetX || currentY !== targetY)
  ) {
    if (board[currentX] && board[currentX][currentY] !== "") {
      return false;
    }

    currentX += directionX;
    currentY += directionY;
  }

  return true;
};

// ---------------------------------------------- KNIGHT MOVE LOGIC ----------------------------------------------
export const validKnightMove = (board, startX, startY, endX, endY) => {
  const deltaX = Math.abs(endX - startX);
  const deltaY = Math.abs(endY - startY);
  if (deltaX + deltaY !== 3 || deltaX === 0 || deltaY === 0) {
    return false;
  }

  if (
    board[endX][endY] !== "" &&
    board[endX][endY].toLowerCase() === board[startX][startY].toLowerCase()
  ) {
    return false;
  }

  return true;
};

// ---------------------------------------------- ROOK MOVE LOGIC ----------------------------------------------
export const validRookMove = (board, startX, startY, endX, endY) => {
  if (startX !== endX && startY !== endY) {
    return false;
  }

  const stepX = startX < endX ? 1 : startX > endX ? -1 : 0;
  const stepY = startY < endY ? 1 : startY > endY ? -1 : 0;

  let currentX = startX + stepX;
  let currentY = startY + stepY;

  while (currentX !== endX || currentY !== endY) {
    if (board[currentX][currentY] !== "") {
      return false;
    }

    currentX += stepX;
    currentY += stepY;
  }

  return true;
};

// ---------------------------------------------- QUEEN MOVE LOGIC ----------------------------------------------

export const validQueenMove = (board, startX, startY, endX, endY) => {
  const isBishopMove = validBishopMove(board, startX, startY, endX, endY);
  const isRookMove = validRookMove(board, startX, startY, endX, endY);

  return isBishopMove || isRookMove;
};
// ---------------------------------------------- KING MOVE LOGIC ----------------------------------------------
export const validKingMove = (board, startX, startY, endX, endY) => {
  const deltaX = Math.abs(endX - startX);
  const deltaY = Math.abs(endY - startY);
  if (deltaX > 1 || deltaY > 1) {
    return false;
  }

  if (
    board[endX][endY] !== "" &&
    board[endX][endY].toLowerCase() === board[startX][startY].toLowerCase()
  ) {
    return false;
  }

  return true;
};

// ---------------------------------------------- CHECK LOGIC ----------------------------------------------
export const pieceValidators = {
  p: validPawnMove,
  b: validBishopMove,
  n: validKnightMove,
  r: validRookMove,
  q: validQueenMove,
  k: validKingMove
};

const getKingPosition = (board, color) => {
  const kingChar = color === "white" ? "K" : "k";

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece === kingChar) {
        return { row, col };
      }
    }
  }

  return null;
};

const isSquareAttacked = (board, row, col, attackingColor) => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (
        piece === "" ||
        (piece === piece.toLowerCase()) !== (attackingColor === "black")
      ) {
        continue;
      }

      if (
        (piece.toLowerCase() === "p" && validPawnMove(board, r, c, row, col)) ||
        (piece.toLowerCase() === "n" &&
          validKnightMove(board, r, c, row, col)) ||
        (piece.toLowerCase() === "b" &&
          validBishopMove(board, r, c, row, col)) ||
        (piece.toLowerCase() === "r" && validRookMove(board, r, c, row, col)) ||
        (piece.toLowerCase() === "q" &&
          validQueenMove(board, r, c, row, col)) ||
        (piece.toLowerCase() === "k" && validKingMove(board, r, c, row, col))
      ) {
        return true;
      }
    }
  }

  return false;
};
export const getAllLegalMoves = (board, color) => {
  const legalMoves = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && (piece.toLowerCase() === piece) === (color === "black")) {
        for (let newRow = 0; newRow < 8; newRow++) {
          for (let newCol = 0; newCol < 8; newCol++) {
            const isValidMove = pieceValidators[piece.toLowerCase()](
              board,
              row,
              col,
              newRow,
              newCol,
              color
            );
            if (isValidMove) {
              const tempBoard = JSON.parse(JSON.stringify(board));
              tempBoard[row][col] = "";
              tempBoard[newRow][newCol] = piece;

              if (!isCheck(tempBoard, color)) {
                legalMoves.push({
                  fromRow: row,
                  fromCol: col,
                  toRow: newRow,
                  toCol: newCol
                });
              }
            }
          }
        }
      }
    }
  }

  return legalMoves;
};

export const isCheck = (board, color, tempKingPosition = null) => {
  let kingPosition = tempKingPosition || getKingPosition(board, color);
  if (kingPosition === null) {
    kingPosition = getKingPosition(board, color);
  }
  if (!kingPosition) {
    return false;
  }
  const { row, col } = kingPosition;

  const attackers = isSquareAttacked(
    board,
    row,
    col,
    color === "white" ? "black" : "white"
  );
  return attackers > 0;
};
// ---------------------------------------------- CHECKMATE LOGIC ----------------------------------------------
export const isCheckmate = (tempBoard, opponent) => {
  const opponentKingPosition = getKingPosition(tempBoard, opponent);
  const opponentKingInCheck = isCheck(
    tempBoard,
    opponent,
    opponentKingPosition
  );
  if (!opponentKingInCheck) {
    return false;
  }

  const legalMoves = getAllLegalMoves(tempBoard, opponent);
  for (const move of legalMoves) {
    const tempBoardAfterMove = JSON.parse(JSON.stringify(tempBoard));
    const piece = tempBoardAfterMove[move.fromRow][move.fromCol];
    tempBoardAfterMove[move.fromRow][move.fromCol] = "";
    tempBoardAfterMove[move.toRow][move.toCol] = piece;
    if (!isCheck(tempBoardAfterMove, opponent, opponentKingPosition)) {
      return false;
    }
  }

  return true;
};

// ---------------------------------------------- CASTLING LOGIC ----------------------------------------------

// ---------------------------------------------- EN PASSANT LOGIC ----------------------------------------------

// ---------------------------------------------- DRAW LOGIC ----------------------------------------------

// ---------------------------------------------- GAME OVER LOGIC ----------------------------------------------
