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
  WhiteRook: { image: WhiteRook, color: "white", type: "rook" },
  WhiteKnight: { image: WhiteKnight, color: "white", type: "knight" },
  WhiteBishop: { image: WhiteBishop, color: "white", type: "bishop" },
  WhiteQueen: { image: WhiteQueen, color: "white", type: "queen" },
  WhiteKing: { image: WhiteKing, color: "white", type: "king" },
  WhitePawn: { image: WhitePawn, color: "white", type: "pawn" },
  BlackRook: { image: BlackRook, color: "black", type: "rook" },
  BlackKnight: { image: BlackKnight, color: "black", type: "knight" },
  BlackBishop: { image: BlackBishop, color: "black", type: "bishop" },
  BlackQueen: { image: BlackQueen, color: "black", type: "queen" },
  BlackKing: { image: BlackKing, color: "black", type: "king" },
  BlackPawn: { image: BlackPawn, color: "black", type: "pawn" }
};

export const createPieceMapper = (boardState) => {
  const piecePositions = {};
  for (const [pieceType, pieces] of Object.entries(boardState)) {
    if (Array.isArray(pieces)) {
      pieces.forEach(({ position, hasMoved }) => {
        piecePositions[position] = {
          ...pieceMapper[pieceType],
          ...(hasMoved !== undefined && { hasMoved })
        };
      });
    } else {
      const { position, hasMoved } = pieces;
      piecePositions[position] = {
        ...pieceMapper[pieceType],
        ...(hasMoved !== undefined && { hasMoved })
      };
    }
  }
  return piecePositions;
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

export const handleDragStart = (event, square) => {
  event.dataTransfer.setData("text/plain", JSON.stringify(square));
};

export const convertBackendBoardToFrontend = (backendBoard, pieceMapper) => {
  const piecePositions = createPieceMapper(backendBoard);
  const board = [
    ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"],
    ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"],
    ["a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"],
    ["a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5"],
    ["a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4"],
    ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"],
    ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"],
    ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"]
  ];
  const coloredBoard = assignSquareColors(board);
  const frontendBoard = initializePieces(
    coloredBoard,
    pieceMapper,
    piecePositions
  );

  return frontendBoard;
};
