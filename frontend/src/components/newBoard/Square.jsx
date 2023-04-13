import React from "react";
const Square = ({
  piece,
  piecemap,
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
          src={piecemap[piece]}
          alt={piece}
          id={coordinates}
          draggable
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          piecemap={piecemap}
          style={{ width: "50px", height: "50px" }}
        />
      )}
    </div>
  );
};

export default Square;
