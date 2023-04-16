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
  a1: { image: WhiteRook, color: "white", type: "rook", hasMoved: false },
  b1: { image: WhiteKnight, color: "white", type: "knight" },
  c1: { image: WhiteBishop, color: "white", type: "bishop" },
  d1: { image: WhiteQueen, color: "white", type: "queen" },
  e1: { image: WhiteKing, color: "white", type: "king", hasMoved: false },
  f1: { image: WhiteBishop, color: "white", type: "bishop" },
  g1: { image: WhiteKnight, color: "white", type: "knight" },
  h1: { image: WhiteRook, color: "white", type: "rook", hasMoved: false },
  a2: { image: WhitePawn, color: "white", type: "pawn" },
  b2: { image: WhitePawn, color: "white", type: "pawn" },
  c2: { image: WhitePawn, color: "white", type: "pawn" },
  d2: { image: WhitePawn, color: "white", type: "pawn" },
  e2: { image: WhitePawn, color: "white", type: "pawn" },
  f2: { image: WhitePawn, color: "white", type: "pawn" },
  g2: { image: WhitePawn, color: "white", type: "pawn" },
  h2: { image: WhitePawn, color: "white", type: "pawn" },
  a7: { image: BlackPawn, color: "black", type: "pawn" },
  b7: { image: BlackPawn, color: "black", type: "pawn" },
  c7: { image: BlackPawn, color: "black", type: "pawn" },
  d7: { image: BlackPawn, color: "black", type: "pawn" },
  e7: { image: BlackPawn, color: "black", type: "pawn" },
  f7: { image: BlackPawn, color: "black", type: "pawn" },
  g7: { image: BlackPawn, color: "black", type: "pawn" },
  h7: { image: BlackPawn, color: "black", type: "pawn" },
  a8: { image: BlackRook, color: "black", type: "rook", hasMoved: false },
  b8: { image: BlackKnight, color: "black", type: "knight" },
  c8: { image: BlackBishop, color: "black", type: "bishop" },
  d8: { image: BlackQueen, color: "black", type: "queen" },
  e8: { image: BlackKing, color: "black", type: "king", hasMoved: false },
  f8: { image: BlackBishop, color: "black", type: "bishop" },
  g8: { image: BlackKnight, color: "black", type: "knight" },
  h8: { image: BlackRook, color: "black", type: "rook", hasMoved: false }
};

export function assignSquareColors(board) {
  return board.map((row, rowIndex) =>
    row.map((square, squareIndex) => ({
      position: square,
      color:
        (rowIndex + squareIndex) % 2 === 0 ? "white-square" : "black-square"
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

export const handleDragStart = (event, square) => {
  event.dataTransfer.setData("text/plain", JSON.stringify(square));
};
