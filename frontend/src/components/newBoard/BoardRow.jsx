import React from "react";
import Square from "./Square";
import { isEven, letters } from "./boardUtils";

const BoardRow = ({
  rowIndex,
  board,
  handleDragStart,
  handleDragOver,
  handleDrop
}) => {
  return (
    <div className="row" key={rowIndex}>
      <div className="row-number p-1">{8 - rowIndex}</div>
      {letters.map((letter, columnIndex) => (
        <Square
          key={columnIndex}
          piece={board[`${letter}${8 - rowIndex}`]}
          squareColor={isEven(rowIndex, columnIndex) ? "white" : "black"}
          coordinates={`${letter}${8 - rowIndex}`}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
        />
      ))}
    </div>
  );
};

export default BoardRow;
