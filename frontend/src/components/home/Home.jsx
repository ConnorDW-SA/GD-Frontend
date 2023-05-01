import React, { useEffect } from "react";
import { useStore } from "../../zustand/store";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbars/Navbar";

const HomePage = () => {
  const logState = useStore((state) => state.logState);
  const currentUser = useStore((state) => state.user);
  const users = useStore((state) => state.users);
  const logout = useStore((state) => state.logout);
  const fetchUsers = useStore((state) => state.fetchUsers);
  const createGame = useStore((state) => state.createGame);
  const fetchUserGames = useStore((state) => state.fetchUserGames);
  const games = useStore((state) => state.userGames);
  const currentUserId = useStore((state) => state.user._id);
  const getOpponentUsername = (game, userId) => {
    return game.player1._id === userId
      ? game.player2.username
      : game.player1.username;
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    logout(navigate);
  };

  useEffect(() => {
    fetchUsers();
    fetchUserGames();
  }, []);

  logState();

  return (
    <div className="main-section-one">
      <Navbar />

      <div className="">
        <h2 className="test">Welcome {currentUser.username}</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="">
        <div className="">
          <h1>users</h1>
          {users && users.length > 0 ? (
            <ul>
              {users.map((user) => (
                <ul key={user._id}>
                  {user.username}{" "}
                  <button onClick={() => createGame(user._id, navigate)}>
                    Create Game
                  </button>
                </ul>
              ))}
            </ul>
          ) : (
            <p>No users</p>
          )}
        </div>

        <div className="">
          <h1>Current Games</h1>
          {games && games.length > 0 ? (
            <ul>
              {games.map((game) => (
                <ul key={game._id}>
                  {getOpponentUsername(game, currentUserId)}
                  <button onClick={() => navigate(`/game/${game._id}`)}>
                    Join Game
                  </button>
                </ul>
              ))}
            </ul>
          ) : (
            <p>No games</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
