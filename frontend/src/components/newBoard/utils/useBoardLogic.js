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
} from "./PieceRules.js";
import { useState } from "react";
import { initialBoard } from "./boardUtils.js";

export const useBoardLogic = () => {
  const [board, setBoard] = useState(initialBoard());
  const [currentTurn, setCurrentTurn] = useState("white");
  const [movedPieces, setMovedPieces] = useState(new Set());

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
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
  return {
    board,
    currentTurn,
    handleDragStart,
    handleDragOver,
    handleDrop
  };
};
