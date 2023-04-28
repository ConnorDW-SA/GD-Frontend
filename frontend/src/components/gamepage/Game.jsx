import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Board from "../board/Board";
import { io } from "socket.io-client";
import { useStore } from "../../zustand/store";

const GamePage = () => {
  const { gameId } = useParams();
  const socket = io("http://localhost:3001");
  const [gameData, setGameData] = useState(null);
  const fetchGameState = useStore((state) => state.fetchGameState);
  const currentUser = useStore((state) => state.user);
  const users = useStore((state) => state.users);
  const allUsers = useMemo(() => [currentUser, ...users], [currentUser, users]);

  useEffect(() => {
    async function fetchData() {
      const fetchedData = await fetchGameState(gameId);
      if (fetchedData) {
        const player1 = allUsers.find(
          (user) => user._id === fetchedData.player1
        );
        const player2 = allUsers.find(
          (user) => user._id === fetchedData.player2
        );
        setGameData({
          ...fetchedData,
          player1: {
            id: fetchedData.player1,
            name: player1.username
          },
          player2: {
            id: fetchedData.player2,
            name: player2.username
          }
        });
      }
    }
    fetchData();
  }, [gameId, allUsers]);

  useEffect(() => {
    socket.emit("join game", gameId);

    return () => {
      socket.disconnect();
    };
  }, [socket, gameId]);

  return (
    <div>
      <div className="d-flex justify-content-between">
        <h1>
          {gameData &&
            gameData.player1 &&
            gameData.player2 &&
            `${gameData.player1.name} vs ${gameData.player2.name}`}
        </h1>
        <Board gameId={gameId} socket={socket} />
        <div>
          <h1>Moves and alerts</h1>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
