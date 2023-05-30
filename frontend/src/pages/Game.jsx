import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Board from "../components/board/Board";
import { io } from "socket.io-client";
import { useStore } from "../zustand/store";
import MyNavbar from "../components/navbars/Navbar";
const GamePage = () => {
  const { gameId } = useParams();
  const socket = io("http://localhost:3001");
  const [gameData, setGameData] = useState(null);
  const fetchCurrentGame = useStore((state) => state.fetchCurrentGame);

  useEffect(() => {
    async function fetchData() {
      const fetchedData = await fetchCurrentGame(gameId);
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
  }, [gameId, fetchCurrentGame]);

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
      </div>
    </div>
  );
};

export default GamePage;
