export const initialBoard = () => {
    const board = {};
    const pieces = [
      ["R", "N", "B", "Q", "K", "B", "N", "R"],
      Array(8).fill("P"),
      Array(8).fill(""),
      Array(8).fill(""),
      Array(8).fill(""),
      Array(8).fill(""),
      Array(8).fill("p"),
      ["r", "n", "b", "q", "k", "b", "n", "r"]
    ];

    const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const position = `${letters[j]}${i + 1}`;
        board[position] = pieces[i][j];
      }
    }

    return board;
  };

  export const isEven = (i, j) => (i + j) % 2 === 0;

  export const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];