import React, { useState, useEffect } from "react";
import {
  assignSquareColors,
  initialBoardState,
  mapPiecesToBoard
} from "./utilities/boardMapper";
import { handleDrop, handleDragStart } from "./utilities/dropLogic";
import { useStore } from "../../zustand/store";
import moveSound from "../../assets/move.mp3";

const Board = ({ gameId, socket, gameState }) => {
  const [loggedInUserColor, setLoggedInUserColor] = useState(null);

  const currentUserId = useStore((state) => state.user._id);
  console.log(gameId);
  const gameData = gameState;
  console.log(gameData);
  const coloredBoard = assignSquareColors(initialBoardState);
  const [chessBoard, setChessBoard] = useState(coloredBoard);
  const updateGameState = useStore((state) => state.updateCurrentGame);
  const playMoveSound = () => {
    const audio = new Audio(moveSound);
    audio.play();
  };
  const set = useStore((state) => state.set);

  useEffect(() => {
    async function fetchData() {
      const fetchedData = gameData;

      if (fetchedData) {
        const updatedBoard = mapPiecesToBoard(
          fetchedData.boardState,
          assignSquareColors(initialBoardState)
        );
        setChessBoard(updatedBoard);
        // setGameData(fetchedData);
      }
    }
    fetchData();
  }, [gameId]);

  return (
    <div>
      <div
        className={`board ${
          loggedInUserColor === "black" ? "board-rotate" : ""
        }`}
      >
        {chessBoard.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="board-row d-flex">
            {row.map((square, squareIndex) => (
              <div
                key={`${square.position}-${squareIndex}`}
                id={square.position}
                className={`board-square ${square.color}  `}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  playMoveSound();
                  handleDrop(
                    event,
                    square,
                    chessBoard,
                    setChessBoard,
                    gameData && gameData.currentPlayer,
                    () => {
                      // setGameData({
                      //   ...gameData,
                      //   currentPlayer:
                      //     gameData.currentPlayer === "white" ? "black" : "white"
                      // });
                    },
                    updateGameState,
                    gameId,
                    socket,

                    set
                  );
                }}
              >
                {square.piece && (
                  <img
                    key={`${square.piece.color}-${square.piece.type}`}
                    src={square.piece.image}
                    alt=""
                    className={`chess-piece ${square.piece.color} ${
                      square.piece.type
                    } ${
                      loggedInUserColor === "black" ? "chess-piece-rotate" : ""
                    }`}
                    draggable={
                      gameId &&
                      gameData &&
                      ((currentUserId === gameData.player1._id &&
                        square.piece.color === "white") ||
                        (currentUserId === gameData.player2._id &&
                          square.piece.color === "black"))
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
