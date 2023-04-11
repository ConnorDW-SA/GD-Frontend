import React from "react";
import { useParams } from "react-router-dom";
import Board from "../newBoard/NewBoard";

const GamePage = () => {
  const { gameId } = useParams();
  return (
    <div>
      <h1>Game Page</h1>
      <Board />
    </div>
  );
};

export default GamePage;
