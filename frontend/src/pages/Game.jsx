import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Board from "../components/board/Board";
import { io } from "socket.io-client";
import { useStore } from "../zustand/store";
import MyNavbar from "../components/navbars/Navbar";
const GamePage = () => {
  const { gameId } = useParams();

  const fetchCurrentGame = useStore((state) => state.fetchCurrentGame);
  const updateCurrentGame = useStore((state) => state.updateCurrentGame);
  const setCurrentPlayerId = useStore((state) => state.setCurrentPlayerId);
  const currentGame = useStore((state) => state.currentGame);
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (gameId) fetchCurrentGame(gameId);
    console.log();
  }, [fetchCurrentGame, gameId]);

  useEffect(() => {
    const newSocket = io("http://localhost:3001", {
      transports: ["websocket"]
    });

    newSocket.emit("fetch_game", gameId);

    newSocket.on("game_updated", (updatedGame) => {
      console.log(updatedGame);
      updateCurrentGame(updatedGame);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [updateCurrentGame, gameId]);

  useEffect(() => {
    const newSocket = io("http://localhost:3001", {
      transports: ["websocket"]
    });

    newSocket.emit("fetch_game", gameId);
    newSocket.on("move_made", (currentPlayerId) => {
      setCurrentPlayerId(currentPlayerId);

      fetchCurrentGame(gameId);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [
    fetchCurrentGame,
    gameId,
    currentGame?.currentPlayer,
    setCurrentPlayerId
  ]);

  return (
    <div>
      <MyNavbar />
      <h1 className="text-center color-pink my-5">
        {currentGame?.player1.username} vs {currentGame?.player2.username}
      </h1>
      <div className="d-flex justify-content-around board-div m-auto pt-5">
        <Board gameId={gameId} socket={socket} gameState={currentGame} />
      </div>
    </div>
  );
};

export default GamePage;
