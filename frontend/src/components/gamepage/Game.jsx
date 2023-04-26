import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Board from "../board/Board";
import { io } from "socket.io-client";

const GamePage = () => {
  const { gameId } = useParams();
  const socket = io("http://localhost:3001");

  useEffect(() => {
    socket.emit("join game", gameId);

    return () => {
      socket.disconnect();
    };
  }, [socket, gameId]);

  return (
    <div>
      <h1>Game Page</h1>
      <Board gameId={gameId} socket={socket} />
    </div>
  );
};

export default GamePage;
