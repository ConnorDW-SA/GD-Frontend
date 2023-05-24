import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Board from "../board/Board";
import { io } from "socket.io-client";
import { useStore } from "../../zustand/store";
import MyNavbar from "../navbars/Navbar";
const GamePage = () => {
  const { gameId } = useParams();
  const currentUserId = useStore((state) => state.user._id);

  const socket = io("http://localhost:3001");
  const [gameData, setGameData] = useState(null);
  const fetchGameState = useStore((state) => state.fetchGameState);
  const getOpponentUsername = (game, userId) => {
    return game.player1._id === userId
      ? game.player2.username
      : game.player1.username;
  };
  useEffect(() => {
    async function fetchData() {
      const fetchedData = await fetchGameState(gameId);
      console.log("this is fetched data", fetchedData);
      if (fetchedData) {
        setGameData({
          ...fetchedData,
          player1: {
            id: fetchedData.player1,
            name: fetchedData.player1.username
          },
          player2: {
            id: fetchedData.player2,
            name: fetchedData.player2.username
          }
        });
      }
    }
    fetchData();
  }, [gameId, fetchGameState]);

  useEffect(() => {
    socket.emit("join game", gameId);

    return () => {
      socket.disconnect();
    };
  }, [socket, gameId]);

  return (
    <div>
      <MyNavbar />
      <h1 className="text-center color-pink my-5">
        {gameData &&
          gameData.player1 &&
          gameData.player2 &&
          `${gameData.player1.name} v ${gameData.player2.name}`}
      </h1>
      <div className="d-flex justify-content-around board-div m-auto pt-5">
        <Board gameId={gameId} socket={socket} />
        {/* <div style={{ maxHeight: "500px", overflowY: "scroll" }}>
          <h1 className="mr-5 color-pink">Moves and alerts</h1>
          {gameData &&
            gameData.moveHistory &&
            gameData.moveHistory.map((move, index) => (
              <p className="text-light" key={index}>
                {move.color} {move.piece} moved from {move.from} to {move.to}
              </p>
            ))}
        </div> */}
      </div>
    </div>
  );
};

export default GamePage;
