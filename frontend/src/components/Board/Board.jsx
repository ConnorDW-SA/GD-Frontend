// ----------------------------- IMPORTS -----------------------------
import React, { useState } from "react";

import {
  validPawnMove,
  validBishopMove,
  validKnightMove,
  validRookMove,
  validQueenMove,
  validKingMove,
  isCheck,
  isCheckmate,
  getAllLegalMoves
} from "./PieceRules";

import Square from "./Square";
import pieceMap from "../newBoard/NewPieceConfig";

// ----------------------------- BOARD -----------------------------
const isEven = (i, j) => (i + j) % 2 === 0;

const Board = () => {
  const [boardDisabled, setBoardDisabled] = useState(false);

  const [player, setPlayer] = useState("white");
  const initialBoard = () => [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    Array(8).fill("p"),
    Array(8).fill(""),
    Array(8).fill(""),
    Array(8).fill(""),
    Array(8).fill(""),
    Array(8).fill("P"),
    ["R", "N", "B", "Q", "K", "B", "N", "R"]
  ];

  const [board, setBoard] = useState(initialBoard);

  const [selectedPiece, setSelectedPiece] = useState(null);

  // ----------------------------- DRAG -----------------------------

  const handleDragStart = (e) => {
    const id = e.target.id;

    const [x, y] = id.split("-").map((val) => parseInt(val));

    const pieceColor =
      board[x][y].toLowerCase() === board[x][y] ? "black" : "white";

    if (pieceColor === player) {
      setSelectedPiece({ piece: board[x][y], x, y });

      e.dataTransfer.setData("text/plain", id);
    } else {
      e.preventDefault();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // ----------------------------- DROP -----------------------------

  const handleDrop = (e) => {
    if (!boardDisabled) {
      e.preventDefault();
      const id = e.target.id;
      const [newX, newY] = id.split("-").map((val) => parseInt(val));

      // Setting up the board

      const tempBoard = board.map((row) => [...row]);

      const piece = tempBoard[selectedPiece.x][selectedPiece.y];

      // Making sure turn doesn't change if the move is invalid

      if (selectedPiece.x === newX && selectedPiece.y === newY) {
        console.log("Same square");
        return;
      }

      // Making sure pieces can't take their own colour and move validation

      const isPieceAtDestinationSquare = tempBoard[newX][newY] !== "";

      const destinationPieceColor = isPieceAtDestinationSquare
        ? tempBoard[newX][newY].toLowerCase() === tempBoard[newX][newY]
          ? "black"
          : "white"
        : null;

      const movingPiece = board[selectedPiece.x][selectedPiece.y];

      const movingPieceColor =
        movingPiece.toLowerCase() === movingPiece ? "black" : "white";

      if (
        movingPieceColor !== player ||
        (isPieceAtDestinationSquare && destinationPieceColor === player)
      ) {
        console.log("Invalid move");
        return;
      }
      const pieceValidators = {
        p: validPawnMove,
        b: validBishopMove,
        n: validKnightMove,
        r: validRookMove,
        q: validQueenMove,
        k: validKingMove
      };

      const movingPieceType = movingPiece.toLowerCase();
      if (
        !pieceValidators[movingPieceType](
          board,
          selectedPiece.x,
          selectedPiece.y,
          newX,
          newY,
          player
        )
      ) {
        console.log("Not a valid move");
        return;
      }
      const destinationSquareHadPiece = isPieceAtDestinationSquare;

      const originalDestinationPiece = tempBoard[newX][newY];

      tempBoard[selectedPiece.x][selectedPiece.y] = "";
      tempBoard[newX][newY] = piece;

      // Pawn Promotion

      if (movingPieceType === "p" && (newX === 0 || newX === 7)) {
        tempBoard[newX][newY] = movingPieceColor === "white" ? "Q" : "q";
      }

      // Check + Checkmate Logic
      const opponent = player === "white" ? "black" : "white";

      const opponentKingInCheckAfterMove = isCheck(tempBoard, opponent);
      const currentPlayerKingInCheckAfterMove = isCheck(tempBoard, player);

      if (currentPlayerKingInCheckAfterMove) {
        alert("You are still in check. Make another move.");
        // Revert the temporary board
        tempBoard[selectedPiece.x][selectedPiece.y] = piece;
        if (destinationSquareHadPiece) {
          tempBoard[newX][newY] = originalDestinationPiece;
        } else {
          tempBoard[newX][newY] = "";
        }
      } else {
        if (isCheckmate(tempBoard, opponent)) {
          alert("Checkmate! You won!");
          setBoard(tempBoard);
          setBoardDisabled(true);
        } else if (opponentKingInCheckAfterMove) {
          alert("Check!");
          setBoard(tempBoard);
          setSelectedPiece(null);
          setPlayer(opponent);
        } else {
          setBoard(tempBoard);
          setSelectedPiece(null);
          setPlayer(opponent);
        }
      }
    }
  };

  // ----------------------------- RENDER -----------------------------

  return (
    <div className="board">
      {board.map((row, i) => (
        <div className="row" key={i}>
          {row.map((piece, j) => (
            <Square
              key={j}
              piece={piece}
              pieceMap={pieceMap}
              squareColor={isEven(i, j) ? "white" : "black"}
              coordinates={`${i}-${j}`}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
export default Board;
