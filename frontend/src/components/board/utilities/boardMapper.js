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

/* 
Assigning pieces to their correct starting position, including hasMoved property which helps castling logic -
Castling cannot occur if rook or king has moved (even if they go back to their starting position)
*/

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

/* 
Mapping color to square, with A1 being black square as per standard chess board
*/

export function assignSquareColors(board) {
  return board.map((row, rowIndex) =>
    row.map((square, squareIndex) => ({
      position: square,
      color:
        (rowIndex + squareIndex) % 2 === 0 ? "white-square" : "black-square"
    }))
  );
}

/* 
Mapping pieces to squares
*/

// In boardMapper.js
export function initializePieces(board, pieceMapper, boardState) {
  return board.map((row) =>
    row.map((square) => ({
      ...square,
      piece: boardState
        ? boardState[square.position]
        : pieceMapper[square.position] || null
    }))
  );
}

/* 
Enabling drag on chess pieces
*/

export const handleDragStart = (event, square) => {
  event.dataTransfer.setData("text/plain", JSON.stringify(square));
};

export const convertBackendBoardToFrontend = (backendBoard, pieceMapper) => {
  const positions = [
    ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"],
    ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"],
    ["a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"],
    ["a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5"],
    ["a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4"],
    ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"],
    ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"],
    ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"]
  ];

  return positions.map((row, rowIndex) =>
    row.map((position, columnIndex) => {
      const pieceData = backendBoard[position];
      const piece = pieceData
        ? { ...pieceMapper[position], ...pieceData }
        : null;
      return {
        position,
        color:
          (rowIndex + columnIndex) % 2 === 0 ? "white-square" : "black-square",
        piece: piece
      };
    })
  );
};

export const convertFrontendBoardToBackend = (frontendBoard) => {
  const backendBoard = {};

  frontendBoard.forEach((row) => {
    row.forEach((square) => {
      if (square.piece) {
        backendBoard[square.position] = {
          type: square.piece.type,
          color: square.piece.color
        };
      }
    });
  });

  return backendBoard;
};
