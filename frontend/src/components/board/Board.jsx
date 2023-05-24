import React, { useState, useEffect } from "react";
import {
  assignSquareColors,
  initialBoardState,
  mapPiecesToBoard
} from "./utilities/boardMapper";
import { handleDrop, handleDragStart } from "./utilities/dropLogic";
import { useStore } from "../../zustand/store";
import moveSound from "../../assets/move.mp3";

const Board = ({ gameId, socket }) => {
  const [loggedInUserColor, setLoggedInUserColor] = useState(null);
  const [gameData, setGameData] = useState(null);
  const currentUserId = useStore((state) => state.user._id);
  const fetchGameState = useStore((state) => state.fetchGameState);
  const coloredBoard = assignSquareColors(initialBoardState);
  const [chessBoard, setChessBoard] = useState(coloredBoard);
  const updateGameState = useStore((state) => state.updateGameState);
  const playMoveSound = () => {
    const audio = new Audio(moveSound);
    audio.play();
  };
  const set = useStore((state) => state.set);

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
      console.log("usercolor:", gameData, currentUserId);
      if (gameData.player1._id === currentUserId) {
        setLoggedInUserColor("white");
      } else if (gameData.player2._id === currentUserId) {
        setLoggedInUserColor("black");
      }
    }
  }, [gameData, currentUserId]);

  useEffect(() => {
    if (socket) {
      socket.on("opponent move", async (moveInfo) => {
        const fetchedData = await fetchGameState(gameId);
        if (fetchedData) {
          const updatedBoard = mapPiecesToBoard(
            fetchedData.boardState,
            assignSquareColors(initialBoardState)
          );
          setChessBoard(updatedBoard);
          setGameData({
            ...fetchedData,
            currentPlayer: moveInfo.currentPlayer
          });
        }
      });

      return () => {
        if (socket) {
          socket.off("opponent move");
        }
      };
    }
  }, [socket, fetchGameState, gameId]);

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
                  if (
                    square.piece &&
                    square.piece.color === gameData.currentPlayer
                  ) {
                    return;
                  }
                  playMoveSound();
                  handleDrop(
                    event,
                    square,
                    chessBoard,
                    setChessBoard,
                    gameData && gameData.currentPlayer,
                    () => {
                      setGameData({
                        ...gameData,
                        currentPlayer:
                          gameData.currentPlayer === "white" ? "black" : "white"
                      });
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
