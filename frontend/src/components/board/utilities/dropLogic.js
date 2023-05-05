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

/* 
handleDrop of piece logic
*/
export const handleDragStart = (event, square) => {
  event.dataTransfer.setData("text/plain", JSON.stringify(square));
};

export async function handleDrop(
  event,
  destinationSquare,
  chessBoard,
  setChessBoard,
  currentTurn,
  setCurrentTurn,
  updateGameState,
  gameId,
  socket,
  moveHistory
) {

  event.preventDefault();
  const sourceSquare = JSON.parse(event.dataTransfer.getData("text/plain"));

  /* 
Preventing turn being skipped if piece is dropped back on original square
*/

  if (sourceSquare.position === destinationSquare.position) {
    console.log("Same Square");
    return;
  }

  /* 
Preventing pieces taking friendly pieces
*/

  if (isSameColorPiece(sourceSquare, destinationSquare)) {
    console.log("Same color piece");
    return;
  }

  /* 
Legal move is defined in pieceMoves.js. Defines how pieces can move according to standard rules of chess. Reverts illegal moves
*/

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

  /* 
Creating a temporary board with the move made to determine legality
*/

  let tempBoard = makeMove(sourceSquare, destinationSquare, chessBoard);

  /* 
Get color of kings
*/

  const movingKingColor = sourceSquare.piece.color;
  const opponentColor = movingKingColor === "white" ? "black" : "white";

  /* 
En passant logic - Checking if piece is pawn, getting last move from function getLastMove in moveHelpers.js
*/

  if (
    sourceSquare.piece.type === "pawn" &&
    legalPawnMove(sourceSquare, destinationSquare, chessBoard)
  ) {
    const lastMove = getLastMove();
    const sourceColumn = sourceSquare.position[0];
    const destinationColumn = destinationSquare.position[0];

    /*
Checking if last move was 2 squares forward by a pawn 
*/

    if (
      lastMove &&
      lastMove.piece.type === "pawn" &&
      lastMove.isPawnDoubleMove &&
      Math.abs(destinationSquare.position[1] - sourceSquare.position[1]) ===
        1 &&
      Math.abs(destinationColumn.charCodeAt(0) - sourceColumn.charCodeAt(0)) ===
        1
    ) {
      /*
Capturing pawn via en passant
*/

      const capturedPawnRow = currentTurn === "white" ? 5 : 4;

      const capturedPawnColumn = destinationSquare.position[0];
      const capturedPawnPosition = `${capturedPawnColumn}${capturedPawnRow}`;
      console.log("En passant captured pawn position:", capturedPawnPosition);
      tempBoard = removePiece(capturedPawnPosition, tempBoard);
    }
  }

  /*
Promoting pawn to queen if it reaches opposite side of the board
*/

  if (
    sourceSquare.piece.type === "pawn" &&
    ((sourceSquare.piece.color === "white" &&
      destinationSquare.position[1] === "8") ||
      (sourceSquare.piece.color === "black" &&
        destinationSquare.position[1] === "1"))
  ) {
    tempBoard = promotePawnToQueen(tempBoard, sourceSquare, destinationSquare);
  }

  /*
Reverting move if king is still in check after move. Checking for check/checkmate
*/

  if (isKingAttacked(movingKingColor, tempBoard)) {
    alert("King is still in check!");
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

  /*
Castling logic - Checking which row rook is on, and where it is going (dependant on player being black or white)
*/

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

    /*
Move the rook after successful castle
*/

    tempBoard = makeMove(
      findSquare(chessBoard, rookSourcePos),
      findSquare(chessBoard, rookDestPos),
      tempBoard
    );
  }

  /*
Updating board state
*/

  await setChessBoard(tempBoard);

  // dropLogic.js

  /*
Checking if opponent king is in check
*/

  isKingAttacked(
    sourceSquare.piece.color === "white" ? "black" : "white",
    tempBoard
  );

  /* 
Storing last piece move (moveHelpers.js function), to enable standard chess notation, then setting turn to other player
White plays first by default
*/
  const getPieceColorAndType = (pieceImg) => {
    const imgClass = pieceImg.getAttribute("class");
    const colorMatch = imgClass.match(/(white|black)/);
    const color = colorMatch ? colorMatch[0] : "";
    const typeMatch = imgClass.match(/(pawn|rook|knight|bishop|queen|king)/);
    const type = typeMatch ? typeMatch[0] : "";

    return { color, type };
  };

  const formatBoardState = (board) => {
    return board.flatMap((row) =>
      row
        .filter((square) => {
          const squareElement = document.getElementById(square.position);
          return squareElement.querySelector("img.chess-piece") !== null;
        })
        .map((square) => {
          const squareElement = document.getElementById(square.position);
          const pieceImg = squareElement.querySelector("img.chess-piece");
          const { color, type } = getPieceColorAndType(pieceImg);
          if (!color || !type) {
            console.error(
              `Error: missing color or type for ${square.position}`
            );
            return null;
          }
          return {
            position: square.position,
            color,
            type
          };
        })
        .filter((square) => square !== null)
    );
  };

  setCurrentTurn(currentTurn === "white" ? "black" : "white");
  const formattedBoardState = formatBoardState(tempBoard);
  const updatedMoveHistory = [
    ...moveHistory,
    {
      from: sourceSquare.position,
      to: destinationSquare.position,
      piece: sourceSquare.piece.type,
      color: sourceSquare.piece.color
    }
  ];

  await updateGameState(
    gameId,
    formattedBoardState,
    currentTurn,
    updatedMoveHistory
  );
  socket.emit("player move", {
    gameId,
    moveInfo: {
      boardState: formattedBoardState,
      currentPlayer: currentTurn === "white" ? "black" : "white",
      currentTurn: currentTurn === "white" ? "black" : "white",
      moveHistory: updatedMoveHistory
    }
  });

  console.log("Emitted move:", {
    gameId,
    moveInfo: {
      boardState: formattedBoardState,
      currentTurn: currentTurn === "white" ? "black" : "white"
    }
  });
  console.log("sourceSquare:", sourceSquare);
  console.log("destinationSquare:", destinationSquare);
  return { newBoard: tempBoard, move: { sourceSquare, destinationSquare } };
}
