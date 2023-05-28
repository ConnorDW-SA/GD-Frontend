import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const ErrorMessages = {
  ServerError: "Server error",
  InvalidCredentials: "Invalid email or password",
  UnknownError: "Unknown error"
};

export const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      userGames: [],
      currentGame: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,
      currentPlayerId: null,

      loginRegister: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(
            `http://localhost:3001/users/${
              data.username ? "register" : "login"
            }`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data)
            }
          );
          if (response.ok) {
            const { user, accessToken } = await response.json();
            localStorage.setItem("accessToken", accessToken);
            set({ user, isLoggedIn: true, isLoading: false });
          } else {
            set({ error: ErrorMessages.InvalidCredentials, isLoading: false });
          }
        } catch (error) {
          set({ error: ErrorMessages.ServerError, isLoading: false });
        }
      },
      logout: () => {
        localStorage.removeItem("accessToken");
        set({
          user: null,
          users: null,
          userGames: null,
          currentGame: null,
          isLoggedIn: false
        });
      },

      setUser: (user) => set({ user }),
      setLoginState: (isLoggedIn) => set({ isLoggedIn }),
      fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("http://localhost:3001/users/allUsers", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
          });
          if (response.ok) {
            const users = await response.json();
            set({ users, isLoading: false });
          } else {
            set({ error: ErrorMessages.ServerError, isLoading: false });
          }
        } catch (error) {
          set({ error: ErrorMessages.ServerError, isLoading: false });
        }
      },
      fetchGames: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(
            "http://localhost:3001/games/userGames",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
              }
            }
          );
          if (response.ok) {
            const userGames = await response.json();
            set({ userGames, isLoading: false });
          } else {
            set({ error: ErrorMessages.ServerError, isLoading: false });
          }
        } catch (error) {
          set({ error: ErrorMessages.ServerError, isLoading: false });
        }
      },
      fetchCurrentGame: async (gameId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(
            `http://localhost:3001/games/${gameId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
              }
            }
          );
          if (response.ok) {
            const gameData = await response.json();
            const { boardState, currentPlayer, player1, player2 } = gameData;
            set({
              currentGame: {
                boardState: boardState,
                currentTurn: currentPlayer,
                player1,
                player2
              },
              isLoading: false
            });
            return {
              boardState: boardState,
              currentTurn: currentPlayer,
              player1,
              player2
            };
          } else {
            set({ error: ErrorMessages.ServerError, isLoading: false });
          }
        } catch (error) {
          set({ error: ErrorMessages.ServerError, isLoading: false });
        }
      },

      updateCurrentGame: async (game) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(
            `http://localhost:3001/games/${game._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
              },
              body: JSON.stringify(game)
            }
          );

          if (response.ok) {
            const updatedGameData = await response.json();
            set({ currentGame: { ...updatedGameData }, isLoading: false });
          } else {
            set({ error: ErrorMessages.ServerError, isLoading: false });
          }
        } catch (error) {
          set({ error: ErrorMessages.ServerError, isLoading: false });
        }
      },
      setCurrentPlayerId: (id) => set({ currentPlayerId: id }),
      logState: () => {
        console.log(
          "Current user:",
          get().user,
          "logged in:",
          get().isLoggedIn,
          "Users:",
          get().users,
          "Games:",
          get().userGames
        );
      }
    }),
    {
      partialize(state) {
        return Object.fromEntries(
          Object.entries(state).filter(([key]) => !["error"].includes(key))
        );
      },
      name: "user",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
