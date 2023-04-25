// Login or register a user, then navigate to the home page.

export const loginRegisterUser = async (
  email,
  password,
  username,
  get,
  set
) => {
  try {
    const response = await fetch(
      `http://localhost:3001/users/${username ? "register" : "login"}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username })
      }
    );

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);

      if (data.user) {
        get().setUser({
          ...data.user,
          username: data.user.username
          // id: data.user._id
        });
        get().setLoginState(true);
      } else {
        console.error("User object not found in response data");
        return false;
      }

      return true;
    } else {
      throw new Error(username ? "Failed to register." : "Failed to login.");
    }
  } catch (error) {
    console.error("Error logging in or registering:", error.message);
    return false;
  }
};

// Logout a user, then navigate to the login page.

export const logoutUser = (navigate, set) => {
  set({ user: null, isLoggedIn: false, users: [], game: null, userGames: [] });
  localStorage.removeItem("accessToken");
  if (navigate) {
    navigate("/");
  }
};

// Fetch all users from the server.

export const fetchUsers = async (set, get) => {
  try {
    const response = await fetch("http://localhost:3001/users/allUsers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      set({ users: data });
    } else {
      throw new Error("Failed to fetch users.");
    }
  } catch (error) {
    console.error("Error fetching users:", error.message);
  }
};

// Create a game with another user.

export const createGame = async (player2, navigate, set) => {
  try {
    const response = await fetch("http://localhost:3001/games/createGame", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      },
      body: JSON.stringify({ player2 })
    });

    if (response.ok) {
      const data = await response.json();
      set({ game: data });
      navigate("/game");
    } else {
      throw new Error("Failed to create game.");
    }
  } catch (error) {
    console.error("Error creating game:", error.message);
  }
};

// Fetch a game by user ID.

export const fetchUserGames = async (set, get) => {
  try {
    const response = await fetch("http://localhost:3001/games/userGames", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      set({ userGames: data });
    } else {
      throw new Error("Failed to fetch user games.");
    }
  } catch (error) {
    console.error("Error fetching user games:", error.message);
  }
};

// Game actions

export const fetchGameState = async (gameId) => {
  try {
    const response = await fetch(`http://localhost:3001/games/${gameId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Fetched game state:", data);
      const { boardState, currentPlayer, player1, player2 } = data;
      return {
        boardState: boardState,
        currentTurn: currentPlayer,
        player1,
        player2
      };
    } else {
      throw new Error("Failed to fetch game state.");
    }
  } catch (error) {
    console.error("Error fetching game state:", error.message);
  }
};

export const updateGameState = async (
  gameId,
  boardState,
  currentPlayer,
  set
) => {
  console.log("updateGameState called with:", {
    gameId,
    boardState,
    currentPlayer
  });
  try {
    const response = await fetch(`http://localhost:3001/games/${gameId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      },
      body: JSON.stringify({
        boardState,
        currentPlayer: currentPlayer
      })
    });

    console.log("Response status:", response.status);
    if (!response.ok) {
      throw new Error("Failed to update game state.");
    }

    const data = await response.json();
    const {
      boardState: updatedBoardState,
      currentPlayer: updatedCurrentPlayer
    } = data;
    set({ board: updatedBoardState, currentPlayer: updatedCurrentPlayer });
  } catch (error) {
    console.error("Error updating game state:", error.message);
  }
};
