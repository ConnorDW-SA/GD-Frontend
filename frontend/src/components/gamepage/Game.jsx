import React from "react";
import { useParams } from "react-router-dom";
import Board from "../board/Board";

const GamePage = () => {
  const { gameId } = useParams();
  return (
    <div>
      <h1>Game Page</h1>
      <Board gameId={gameId} />
    </div>
  );
};

export default GamePage;
