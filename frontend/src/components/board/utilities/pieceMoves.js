import {
  isVerticalMove,
  isDiagonalMove,
  isHorizontalMove,
  isMoveObstructed
} from "./moveHelpers";

export const legalPawnMove = (
  sourceSquare,
  destinationSquare,
  chessBoard,
  lastMove
) => {
  const sourceRow = parseInt(sourceSquare.position[1]);
  const destinationRow = parseInt(destinationSquare.position[1]);
  const sourceColumn = sourceSquare.position[0];
  const destinationColumn = destinationSquare.position[0];
  const isWhite = sourceSquare.piece.color === "white";

  const direction = isWhite ? 1 : -1;
  const moveDistance = destinationRow - sourceRow;

  const isFirstMove =
    (isWhite && sourceRow === 2) || (!isWhite && sourceRow === 7);
  const isForwardOneSquare = moveDistance === direction;
  const isForwardTwoSquares = moveDistance === 2 * direction;
  const isVerticalOneOrTwoSquares =
    isForwardOneSquare || (isFirstMove && isForwardTwoSquares);

  const isSameColumn = sourceColumn === destinationColumn;
  const isDiagonalCapture =
    Math.abs(sourceColumn.charCodeAt(0) - destinationColumn.charCodeAt(0)) ===
      1 &&
    moveDistance === direction &&
    destinationSquare.piece;

  if (
    (isSameColumn && isVerticalOneOrTwoSquares && !destinationSquare.piece) ||
    isDiagonalCapture
  )
    if (
      (isSameColumn && isVerticalOneOrTwoSquares && !destinationSquare.piece) ||
      isDiagonalCapture
    ) {
      if (
        !isMoveObstructed(
          sourceSquare,
          destinationSquare,
          chessBoard,
          isVerticalOneOrTwoSquares ? "vertical" : "diagonal"
        )
      ) {
        return true;
      }
    }

  return false;
};

export const legalRookMove = (sourceSquare, destinationSquare, chessBoard) => {
  const sourcePosition = sourceSquare.position;
  const destinationPosition = destinationSquare.position;
  const isVertical = isVerticalMove(sourcePosition, destinationPosition);
  const isHorizontal = isHorizontalMove(sourcePosition, destinationPosition);

  if (!(isVertical || isHorizontal)) {
    return false;
  }

  const direction = isVertical ? "vertical" : "horizontal";

  if (
    isMoveObstructed(sourceSquare, destinationSquare, chessBoard, direction)
  ) {
    return false;
  }

  return true;
};

export const legalKnightMove = (sourceSquare, destinationSquare) => {
  const sourceRow = parseInt(sourceSquare.position[1]);
  const sourceColumn = sourceSquare.position[0].charCodeAt(0);
  const destinationRow = parseInt(destinationSquare.position[1]);
  const destinationColumn = destinationSquare.position[0].charCodeAt(0);

  const rowDifference = Math.abs(destinationRow - sourceRow);
  const columnDifference = Math.abs(destinationColumn - sourceColumn);

  return (
    (rowDifference === 2 && columnDifference === 1) ||
    (rowDifference === 1 && columnDifference === 2)
  );
};

export const legalBishopMove = (
  sourceSquare,
  destinationSquare,
  chessBoard
) => {
  if (isDiagonalMove(sourceSquare, destinationSquare)) {
    if (
      !isMoveObstructed(sourceSquare, destinationSquare, chessBoard, "diagonal")
    ) {
      return true;
    }
  }

  return false;
};

export const legalQueenMove = (sourceSquare, destinationSquare, chessBoard) => {
  if (
    legalRookMove(sourceSquare, destinationSquare, chessBoard) ||
    legalBishopMove(sourceSquare, destinationSquare, chessBoard)
  ) {
    return true;
  }

  return false;
};

export const legalKingMove = (sourceSquare, destinationSquare, chessBoard) => {
  const sourceRow = parseInt(sourceSquare.position[1]);
  const destinationRow = parseInt(destinationSquare.position[1]);
  const sourceColumn = sourceSquare.position[0];
  const destinationColumn = destinationSquare.position[0];

  const rowDifference = Math.abs(destinationRow - sourceRow);
  const columnDifference = Math.abs(
    destinationColumn.charCodeAt(0) - sourceColumn.charCodeAt(0)
  );

  const isValidMove =
    (isVerticalMove(sourceColumn, destinationColumn) && rowDifference === 1) ||
    (isHorizontalMove(sourceRow, destinationRow) && columnDifference === 1) ||
    (isDiagonalMove(sourceSquare, destinationSquare) &&
      rowDifference === 1 &&
      columnDifference === 1);

  if (isValidMove) {
    if (
      !isMoveObstructed(
        sourceSquare,
        destinationSquare,
        chessBoard,
        isVerticalMove(sourceColumn, destinationColumn)
          ? "vertical"
          : isHorizontalMove(sourceRow, destinationRow)
          ? "horizontal"
          : "diagonal"
      )
    ) {
      return true;
    }
  }

  return false;
};
