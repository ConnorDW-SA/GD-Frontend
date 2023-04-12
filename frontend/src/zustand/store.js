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

        setUser: (user) => set({ user }),
        setLoginState: (isLoggedIn) => set({ isLoggedIn }),
        loginRegisterUser: (email, password, username) =>
          loginRegisterUser(email, password, username, get, set),
        setUsers: (users) => set({ users }),
        fetchUsers: () => fetchUsers(set, get),
        createGame: (player2, navigate) => createGame(player2, navigate, set),
        fetchUserGames: () => fetchUserGames(set, get),
        setGames: (games) => set({ games }),
        fetchGameState: (gameId) => fetchGameState(gameId, set, get),

        updateGameState: (gameId, boardState, currentPlayer) =>
          updateGameState(gameId, boardState, currentPlayer, set),

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
