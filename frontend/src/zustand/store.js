import { create } from "zustand";

const useStore = create((set, get) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user) => set({ user }),
  setLoginState: (isLoggedIn) => set({ isLoggedIn }),

  loginRegisterUser: async (email, password, username) => {
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
          get().setUser({ ...data.user, username: data.user.username });
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
  }
}));

export default useStore;
