import React, { useState, useEffect } from "react";
import {
  assignSquareColors,
  initialBoardState,
  mapPiecesToBoard
} from "./utilities/boardMapper";
import { handleDrop, handleDragStart } from "./utilities/dropLogic";
import { useStore } from "../../zustand/store";

const Board = ({ gameId }) => {
  const [currentTurn, setCurrentTurn] = useState("white");
  const fetchGameState = useStore((state) => state.fetchGameState);

  const coloredBoard = assignSquareColors(initialBoardState);
  const [chessBoard, setChessBoard] = useState(coloredBoard);

  useEffect(() => {
    async function fetchData() {
      const fetchedData = await fetchGameState(gameId);
      if (fetchedData) {
        const updatedBoard = mapPiecesToBoard(
          fetchedData,
          assignSquareColors(initialBoardState)
        );
        setChessBoard(updatedBoard);
      }
    }
    fetchData();
  }, [fetchGameState, gameId]);

  // ...rest of the code

  return (
    <div>
      <h1>Chess Board</h1>
      <div className="board">
        {chessBoard.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="board-row d-flex">
            {row.map((square, squareIndex) => (
              <div
                key={`${square.position}-${squareIndex}`}
                id={square.position}
                className={`board-square ${square.color}`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  handleDrop(
                    event,
                    square,
                    chessBoard,
                    setChessBoard,
                    currentTurn,
                    setCurrentTurn,
                    gameId
                  );
                }}
              >
                {square.piece && (
                  <img
                    src={square.piece.image}
                    alt=""
                    className={`chess-piece ${square.piece.color} ${square.piece.type}`}
                    draggable={gameId && currentTurn === square.piece.color}
                    onDragStart={(event) => handleDragStart(event, square)}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
