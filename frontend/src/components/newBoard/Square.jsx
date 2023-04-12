import React from "react";
import pieceMap from "./utils/pieceMap";
const Square = ({
  piece,
  pieceMap,
  squareColor,
  coordinates,
  handleDragStart,
  handleDragOver,
  handleDrop
}) => {
  return (
    <div
      className={`square ${squareColor}`}
      id={coordinates}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {piece && (
        <img
          src={pieceMap[piece]}
          alt={piece}
          id={coordinates}
          draggable
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          pieceMap={pieceMap}
          style={{ width: "50px", height: "50px" }}
        />
      )}
    </div>
  );
};

export default Square;
