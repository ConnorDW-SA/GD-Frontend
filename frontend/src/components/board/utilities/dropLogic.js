import { isSameColorPiece, logPieceMove } from "./moveHelpers";

import {
  legalPawnMove,
  legalRookMove,
  legalKnightMove,
  legalBishopMove,
  legalQueenMove,
  legalKingMove
} from "./pieceMoves";

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
    sourceSquare.piece.type === "pawn" &&
    !legalPawnMove(sourceSquare, destinationSquare, chessBoard)
  ) {
    console.log("not legal pawn move");
    return;
  }
  if (
    sourceSquare.piece.type === "rook" &&
    !legalRookMove(sourceSquare, destinationSquare, chessBoard)
  ) {
    console.log("not legal rook move");
    return;
  }
  if (
    sourceSquare.piece.type === "knight" &&
    !legalKnightMove(sourceSquare, destinationSquare, chessBoard)
  ) {
    console.log("not legal knight move");
    return;
  }
  if (
    sourceSquare.piece.type === "bishop" &&
    !legalBishopMove(sourceSquare, destinationSquare, chessBoard)
  ) {
    console.log("not legal bishop move");
    return;
  }
  if (
    sourceSquare.piece.type === "queen" &&
    !legalQueenMove(sourceSquare, destinationSquare, chessBoard)
  ) {
    console.log("not legal queen move");
    return;
  }
  if (
    sourceSquare.piece.type === "king" &&
    !legalKingMove(sourceSquare, destinationSquare, chessBoard)
  ) {
    console.log("not legal king move");
    return;
  }

  const updatedBoard = chessBoard.map((row) =>
    row.map((square) => {
      if (square.position === sourceSquare.position) {
        return { ...square, piece: null };
      }
      if (square.position === destinationSquare.position) {
        return { ...square, piece: sourceSquare.piece };
      }
      return square;
    })
  );
  setLastMove({ sourceSquare, destinationSquare });
  setChessBoard(updatedBoard);
  logPieceMove(sourceSquare, destinationSquare);

  setIsWhiteTurn(!isWhiteTurn);
};
