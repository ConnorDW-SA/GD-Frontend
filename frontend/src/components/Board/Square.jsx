import React from "react";

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
          style={{ width: "50px", height: "50px" }}
        />
      )}
    </div>
  );
};

export default Square;
