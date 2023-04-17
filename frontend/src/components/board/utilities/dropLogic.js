import {
  isSameColorPiece,
  logPieceMove,
  getLastMove,
  removePiece
} from "./moveHelpers";

import {
  isLegalMove,
  isKingAttacked,
  isCheckmate,
  makeMove,
  findSquare,
  promotePawnToQueen,
  legalPawnMove
} from "./pieceMoves";

export const handleDrop = (
  event,
  destinationSquare,
  chessBoard,
  setChessBoard,
  isWhiteTurn,
  setIsWhiteTurn
) => {
  const lastMove = null;

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

  let tempBoard = makeMove(sourceSquare, destinationSquare, chessBoard);
  const movingKingColor = sourceSquare.piece.color;
  const opponentColor = movingKingColor === "white" ? "black" : "white";

  if (
    sourceSquare.piece.type === "pawn" &&
    legalPawnMove(sourceSquare, destinationSquare, chessBoard)
  ) {
    const lastMove = getLastMove();
    const sourceColumn = sourceSquare.position[0];
    const destinationColumn = destinationSquare.position[0];
    if (
      lastMove &&
      lastMove.piece.type === "pawn" &&
      lastMove.isPawnDoubleMove &&
      Math.abs(destinationSquare.position[1] - sourceSquare.position[1]) ===
        1 &&
      Math.abs(destinationColumn.charCodeAt(0) - sourceColumn.charCodeAt(0)) ===
        1
    ) {
      const capturedPawnRow = isWhiteTurn ? 5 : 4;
      const capturedPawnColumn = destinationSquare.position[0];
      const capturedPawnPosition = `${capturedPawnColumn}${capturedPawnRow}`;
      console.log("En passant captured pawn position:", capturedPawnPosition);
      tempBoard = removePiece(capturedPawnPosition, tempBoard);
    }
  }

  if (
    sourceSquare.piece.type === "pawn" &&
    ((sourceSquare.piece.color === "white" &&
      destinationSquare.position[1] === "8") ||
      (sourceSquare.piece.color === "black" &&
        destinationSquare.position[1] === "1"))
  ) {
    tempBoard = promotePawnToQueen(tempBoard, sourceSquare, destinationSquare);
  }


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

  const columnDifference = Math.abs(
    destinationSquare.position.charCodeAt(0) -
      sourceSquare.position.charCodeAt(0)
  );
  if (sourceSquare.piece.type === "king" && columnDifference === 2) {
    const rookSourceColumn =
      destinationSquare.position[0] < sourceSquare.position[0] ? "a" : "h";
    const rookDestColumn =
      destinationSquare.position[0] < sourceSquare.position[0] ? "d" : "f";
    const rookRow = sourceSquare.position[1];

    const rookSourcePos = `${rookSourceColumn}${rookRow}`;
    const rookDestPos = `${rookDestColumn}${rookRow}`;

    tempBoard = makeMove(
      findSquare(chessBoard, rookSourcePos),
      findSquare(chessBoard, rookDestPos),
      tempBoard
    );
  }

  setChessBoard(tempBoard);

  isKingAttacked(
    sourceSquare.piece.color === "white" ? "black" : "white",
    tempBoard
  );

  logPieceMove(sourceSquare, destinationSquare);
  setIsWhiteTurn(!isWhiteTurn);
};
