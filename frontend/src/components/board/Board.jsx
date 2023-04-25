import React, { useState, useEffect } from "react";
import {
  assignSquareColors,
  initialBoardState,
  mapPiecesToBoard
} from "./utilities/boardMapper";
import { handleDrop, handleDragStart } from "./utilities/dropLogic";
import { useStore } from "../../zustand/store";

const Board = ({ gameId }) => {
  const [loggedInUserColor, setLoggedInUserColor] = useState(null);
  const [gameData, setGameData] = useState(null);

  const currentUser = useStore((state) => state.user);
  const currentUserId = useStore((state) => state.user._id);
  const fetchGameState = useStore((state) => state.fetchGameState);
  const coloredBoard = assignSquareColors(initialBoardState);
  const [chessBoard, setChessBoard] = useState(coloredBoard);
  const updateGameState = useStore((state) => state.updateGameState);

  useEffect(() => {
    async function fetchData() {
      const fetchedData = await fetchGameState(gameId);
      if (fetchedData) {
        const updatedBoard = mapPiecesToBoard(
          fetchedData.boardState,
          assignSquareColors(initialBoardState)
        );
        setChessBoard(updatedBoard);
        setGameData(fetchedData);
      }
    }
    fetchData();
  }, [gameId]);

  useEffect(() => {
    if (gameData) {
      if (gameData.player1 === currentUserId) {
        setLoggedInUserColor("white");
      } else if (gameData.player2 === currentUserId) {
        setLoggedInUserColor("black");
      }
    }
  }, [gameData, currentUserId]);

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
                    gameData && gameData.currentTurn,
                    () => {
                      // This function sets the current turn to the next player.
                      setGameData({
                        ...gameData,
                        currentTurn:
                          gameData.currentTurn === "white" ? "black" : "white"
                      });
                    },
                    updateGameState,
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
                      gameId &&
                      gameData &&
                      currentUserId === gameData.currentTurn && // Changed from gameData.currentPlayer
                      square.piece.color === loggedInUserColor
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
