import React, { useState, useEffect } from "react";
import pieceMap from "./NewPieceConfig";
import Square from "./NewSquare";

import { useParams } from "react-router-dom";
import { useStore } from "../../zustand/store";

const Board = () => {
  const [loading, setLoading] = useState(true);
  const [fetchedBoard, setFetchedBoard] = useState(null);
  const [fetchedTurn, setFetchedTurn] = useState(null);
  const logState = useStore((state) => state.logState);

  // const { fetchGameState, updateGameState } = useStore((state) => ({
  //   fetchGameState: state.fetchGameState,
  //   updateGameState: state.updateGameState
  // }));

  // const boardTo2DArray = (board) => {
  //   const array = Array(8)
  //     .fill(null)
  //     .map(() => Array(8).fill(""));
  //   const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

  //   for (let i = 0; i < 8; i++) {
  //     for (let j = 0; j < 8; j++) {
  //       const position = `${letters[j]}${i + 1}`;
  //       array[i][j] = board[position];
  //     }
  //   }

  //   return array;
  // };

  const { gameId } = useParams();
  const [movedPieces, setMovedPieces] = useState(new Set());

  // useEffect(() => {
  //   const fetchAndSetGameState = async () => {
  //     try {
  //       const fetchedGameState = await fetchGameState(gameId);

  //       if (fetchedGameState) {
  //         const { board: fetchedBoardState, currentTurn: fetchedTurn } =
  //           fetchedGameState;
  //         setFetchedBoard(boardTo2DArray(fetchedBoardState));
  //         setFetchedTurn(fetchedTurn);
  //         logState();
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch game state:", error);
  //     }
  //   };

  //   fetchAndSetGameState();
  // }, [gameId, logState, fetchGameState]);

  // useEffect(() => {
  //   if (fetchedBoard && fetchedTurn) {
  //     setBoard(fetchedBoard);
  //     setCurrentTurn(fetchedTurn);
  //   }
  //   setLoading(false);
  // }, [fetchedBoard, fetchedTurn]);

  const [board, setBoard] = useState(initialBoard());

  const [currentTurn, setCurrentTurn] = useState("white");

  // --------------------------------------------------------------------

  // try {
  //   await updateGameState(gameId, boardTo2DArray(updatedBoard), currentTurn);
  //   logState();
  // } catch (error) {
  //   console.error("Failed to update game state:", error);
  // }

  return (
    <>
      {/* {loading ? (
        <p>Loading...</p>
      ) : ( */}
      <div className="board">
        {Array.from({ length: 8 }, (_, i) => (
          <div className="row" key={i}>
            <div className="row-number p-1">{8 - i}</div>
            {letters.map((letter, j) => (
              <Square
                key={j}
                piece={board[`${letter}${8 - i}`]}
                pieceMap={pieceMap}
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
      )}
    </>
  );
};

export default Board;
