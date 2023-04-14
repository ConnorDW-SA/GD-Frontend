export const handleDragStart = (event, square) => {
  event.dataTransfer.setData("text/plain", JSON.stringify(square));
};

export const handleDrop = (
  event,
  destinationSquare,
  chessBoard,
  setChessBoard
) => {
  event.preventDefault();
  const sourceSquare = JSON.parse(event.dataTransfer.getData("text/plain"));

  if (sourceSquare.position === destinationSquare.position) {
    return;
  }

  const updatedBoard = chessBoard.map((row) =>
    row.map((square) => {
      if (square.position === sourceSquare.position) {
        return { ...square, piece: null };
      }
      if (square.position === destinationSquare.position) {
        return { ...square, piece: sourceSquare.piece };
      }
      return square;
    })
  );

  setChessBoard(updatedBoard);
};
