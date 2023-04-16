import { isSameColorPiece, logPieceMove } from "./moveHelpers";

import { isLegalMove, isKingAttacked, isCheckmate } from "./pieceMoves";

export const handleDrop = (
  event,
  destinationSquare,
  chessBoard,
  setChessBoard,
  isWhiteTurn,
  setIsWhiteTurn,
  setLastMove
) => {
  event.preventDefault();
  const sourceSquare = JSON.parse(event.dataTransfer.getData("text/plain"));

  if (sourceSquare.position === destinationSquare.position) {
    console.log("Same Square");
    return;
  }

  if (isSameColorPiece(sourceSquare, destinationSquare)) {
    console.log("Same color piece");
    return;
  }

  if (
    !isLegalMove(
      sourceSquare,
      destinationSquare,
      chessBoard,
      sourceSquare.piece.type
    )
  ) {
    console.log("not legal move");
    return;
  }

  const makeMove = (sourceSquare, destinationSquare, board) => {
    return board.map((row) =>
      row.map((square) => {
        if (square.position === sourceSquare.position) {
          return { ...square, piece: null };
        }
        if (square.position === destinationSquare.position) {
          return {
            ...square,
            piece: { ...sourceSquare.piece, hasMoved: true }
          };
        }
        return square;
      })
    );
  };

  const tempBoard = makeMove(sourceSquare, destinationSquare, chessBoard);
  const movingKingColor = sourceSquare.piece.color;
  const opponentColor = movingKingColor === "white" ? "black" : "white";

  if (isKingAttacked(movingKingColor, tempBoard)) {
    alert("king cannot move there because he is still in check!");
    return;
  } else {
    if (isKingAttacked(opponentColor, tempBoard)) {
      if (isCheckmate(opponentColor, tempBoard)) {
        alert("checkmate ");
      } else {
        alert("this is normal check, because the king can get out of it");
      }
    }
  }

  setLastMove({ sourceSquare, destinationSquare });
  setChessBoard(tempBoard);
  logPieceMove(sourceSquare, destinationSquare);
  isKingAttacked(
    sourceSquare.piece.color === "white" ? "black" : "white",
    tempBoard
  );
  setIsWhiteTurn(!isWhiteTurn);
};

