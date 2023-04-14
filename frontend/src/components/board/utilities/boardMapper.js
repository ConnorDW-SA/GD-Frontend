import BlackKing from "../../../assets/pieces/b-king.png";
import BlackQueen from "../../../assets/pieces/b-queen.png";
import BlackBishop from "../../../assets/pieces/b-bishop.png";
import BlackKnight from "../../../assets/pieces/b-knight.png";
import BlackRook from "../../../assets/pieces/b-rook.png";
import BlackPawn from "../../../assets/pieces/b-pawn.png";
import WhiteKing from "../../../assets/pieces/w-king.png";
import WhiteQueen from "../../../assets/pieces/w-queen.png";
import WhiteBishop from "../../../assets/pieces/w-bishop.png";
import WhiteKnight from "../../../assets/pieces/w-knight.png";
import WhiteRook from "../../../assets/pieces/w-rook.png";
import WhitePawn from "../../../assets/pieces/w-pawn.png";

export const pieceMapper = {
  a1: WhiteRook,
  b1: WhiteKnight,
  c1: WhiteBishop,
  d1: WhiteQueen,
  e1: WhiteKing,
  f1: WhiteBishop,
  g1: WhiteKnight,
  h1: WhiteRook,
  a2: WhitePawn,
  b2: WhitePawn,
  c2: WhitePawn,
  d2: WhitePawn,
  e2: WhitePawn,
  f2: WhitePawn,
  g2: WhitePawn,
  h2: WhitePawn,
  a7: BlackPawn,
  b7: BlackPawn,
  c7: BlackPawn,
  d7: BlackPawn,
  e7: BlackPawn,
  f7: BlackPawn,
  g7: BlackPawn,
  h7: BlackPawn,
  a8: BlackRook,
  b8: BlackKnight,
  c8: BlackBishop,
  d8: BlackQueen,
  e8: BlackKing,
  f8: BlackBishop,
  g8: BlackKnight,
  h8: BlackRook
};

export function assignSquareColors(board) {
  return board.map((row, rowIndex) =>
    row.map((square, squareIndex) => ({
      position: square,
      color: (rowIndex + squareIndex) % 2 === 0 ? "white" : "black"
    }))
  );
}

export function initializePieces(board, pieceMapper) {
  return board.map((row) =>
    row.map((square) => ({
      ...square,
      piece: pieceMapper[square.position] || null
    }))
  );
}
