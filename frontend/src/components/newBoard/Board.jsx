import React, { useState, useEffect } from "react";
import piecemap from "./utils/pieceMap";
import Square from "./Square";
import {
  isTakingOwnPiece,
  isCorrectTurn,
  isSameSquare,
  validPawnMove,
  validBishopMove,
  validKnightMove,
  validRookMove,
  validQueenMove,
  validKingMove,
  isKingInCheck
} from "./utils/PieceRules";

const Board = () => {
  const [movedPieces, setMovedPieces] = useState(new Set());
  const initialBoard = () => {
    const board = {};
    const pieces = [
      ["R", "N", "B", "Q", "K", "B", "N", "R"],
      Array(8).fill("P"),
      Array(8).fill(""),
      Array(8).fill(""),
      Array(8).fill(""),
      Array(8).fill(""),
      Array(8).fill("p"),
      ["r", "n", "b", "q", "k", "b", "n", "r"]
    ];

    const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const position = `${letters[j]}${i + 1}`;
        board[position] = pieces[i][j];
      }
    }

    return board;
  };

  const isEven = (i, j) => (i + j) % 2 === 0;
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const [board, setBoard] = useState(initialBoard());

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const [currentTurn, setCurrentTurn] = useState("white");

  // --------------------------------------------------------------------

  const handleDrop = async (e) => {
    e.preventDefault();
    const fromCoordinates = e.dataTransfer.getData("text/plain");
    const toCoordinates = e.target.id || e.target.parentElement.id;
    const piece = board[fromCoordinates];

    if (
      isSameSquare(fromCoordinates, toCoordinates) ||
      !isTakingOwnPiece(board, fromCoordinates, toCoordinates) ||
      !isCorrectTurn(piece, currentTurn)
    ) {
      return;
    }

    const pieceType = piece.toLowerCase();

    if (
      (pieceType === "p" &&
        !validPawnMove(board, fromCoordinates, toCoordinates)) ||
      (pieceType === "b" &&
        !validBishopMove(board, fromCoordinates, toCoordinates)) ||
      (pieceType === "n" && !validKnightMove(fromCoordinates, toCoordinates)) ||
      (pieceType === "r" &&
        !validRookMove(board, fromCoordinates, toCoordinates)) ||
      (pieceType === "q" &&
        !validQueenMove(board, fromCoordinates, toCoordinates)) ||
      (pieceType === "k" &&
        !validKingMove(board, fromCoordinates, toCoordinates, movedPieces))
    ) {
      console.log("invalid move");
      return;
    }

    const updatedBoard = {
      ...board,
      [fromCoordinates]: "",
      [toCoordinates]: piece
    };

    if (
      pieceType === "k" &&
      Math.abs(toCoordinates.charCodeAt(0) - fromCoordinates.charCodeAt(0)) ===
        2
    ) {
      const isWhite = piece.toUpperCase() === piece;

      const isKingSide =
        toCoordinates.charCodeAt(0) > fromCoordinates.charCodeAt(0);

      const rookStartPosition = isKingSide
        ? isWhite
          ? "H1"
          : "H8"
        : isWhite
        ? "A1"
        : "A8";
      const rookEndPosition = isKingSide
        ? isWhite
          ? "F1"
          : "F8"
        : isWhite
        ? "D1"
        : "D8";

      updatedBoard[rookStartPosition] = "";
      updatedBoard[rookEndPosition] = isWhite ? "R" : "r";
    }

    if (isKingInCheck(updatedBoard, currentTurn, movedPieces)) {
      console.log("invalid move");
      return;
    }

    const opponentColor = currentTurn === "white" ? "black" : "white";

    if (isKingInCheck(updatedBoard, opponentColor, movedPieces)) {
      console.log("Check!");
    }

    setBoard(updatedBoard);

    setBoard(updatedBoard);

    setMovedPieces((prevMovedPieces) => {
      const newMovedPieces = new Set(prevMovedPieces);
      newMovedPieces.add(fromCoordinates);
      return newMovedPieces;
    });

    setCurrentTurn((prevTurn) => (prevTurn === "white" ? "black" : "white"));
  };

  return (
    <>
      <div className="board">
        {Array.from({ length: 8 }, (_, i) => (
          <div className="row" key={i}>
            <div className="row-number p-1">{8 - i}</div>
            {letters.map((letter, j) => (
              <Square
                key={j}
                piece={board[`${letter}${8 - i}`]}
                piecemap={piecemap}
                squareColor={isEven(i, j) ? "white" : "black"}
                coordinates={`${letter}${8 - i}`}
                handleDragStart={handleDragStart}
                handleDragOver={handleDragOver}
                handleDrop={handleDrop}
              />
            ))}
          </div>
        ))}
        <div className="column-letters">
          {letters.map((letter, i) => (
            <div className="column-letter" key={i}>
              {letter}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Board;
