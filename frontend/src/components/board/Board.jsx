import React, { useState, useEffect } from "react";
import {
  pieceMapper,
  assignSquareColors,
  initializePieces,
  handleDragStart,
  convertBackendBoardToFrontend
} from "./utilities/boardMapper";
import { handleDrop } from "./utilities/dropLogic";
import { useStore } from "../../zustand/store";

const Board = ({ gameId }) => {
  const board = [
    ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"],
    ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"],
    ["a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"],
    ["a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5"],
    ["a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4"],
    ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"],
    ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"],
    ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"]
  ];

  const [currentTurn, setCurrentTurn] = useState("white");
  const fetchGameState = useStore((state) => state.fetchGameState);
  const [isGameDataFetched, setIsGameDataFetched] = useState(false);

  const coloredBoard = assignSquareColors(board);
  const chessBoardWithPieces = initializePieces(coloredBoard, pieceMapper);
  const [chessBoard, setChessBoard] = useState(chessBoardWithPieces);

  useEffect(() => {
    async function fetchData() {
      const fetchedData = await fetchGameState(gameId);
      if (fetchedData) {
        const frontendBoard = convertBackendBoardToFrontend(
          fetchedData.board,
          pieceMapper
        );
        console.log("Frontend Board:", frontendBoard);
        setChessBoard(frontendBoard);
        setIsGameDataFetched(true);
      }
    }
    fetchData();
  }, [fetchGameState, gameId]);

  console.log("Chess Board State:", chessBoard);

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
                    draggable={
                      isGameDataFetched && currentTurn === square.piece.color
                    }
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
