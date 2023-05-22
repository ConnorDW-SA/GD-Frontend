import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  loginRegisterUser,
  logoutUser,
  fetchUsers,
  createGame,
  fetchUserGames,
  fetchGameState,
  updateGameState
} from "./actions";

export const useStore = create(
  persist(
    (set, get) => {
      const logState = () => {
        console.log("Current state: ", get());
      };

      return {
        user: null,
        isLoggedIn: false,
        board: null,
        currentTurn: "white",
        setUser: (user) => set({ user }),
        setLoginState: (isLoggedIn) => set({ isLoggedIn: true }),
        loginRegisterUser: (email, password, username) =>
          loginRegisterUser(email, password, username, get, set),
        setUsers: (users) => set({ users }),
        fetchUsers: () => fetchUsers(set, get),
        createGame: async (player2) => {
          const gameId = await createGame(player2, set);
          return gameId;
        },

        fetchUserGames: () => fetchUserGames(set, get),
        setGames: (games) => set({ games }),
        fetchGameState: (gameId) => fetchGameState(gameId, set, get),

        updateGameState: (gameId, boardState, currentPlayer, moveHistory) =>
          updateGameState(gameId, boardState, currentPlayer, moveHistory, set),

        setBoard: (board) => set({ board }),
        logState,
        logout: (navigate) => {
          logoutUser(navigate, set);
        }
      };
    },
    {
      name: "user",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
