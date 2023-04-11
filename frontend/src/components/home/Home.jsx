import React, { useEffect } from "react";
import { useStore } from "../../zustand/store";
import { useNavigate } from "react-router-dom";

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
    <>
      <div className="d-flex w-100 justify-content-between">
        <h1>Home Page</h1>
        <h2>Welcome {currentUser.username}</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="d-flex">
        <div className="m-5">
          <h1>users</h1>
          {users && users.length > 0 ? (
            <ul>
              {users.map((user) => (
                <li key={user._id}>
                  {user.username}{" "}
                  <button onClick={() => createGame(user._id, navigate)}>
                    Create Game
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No users</p>
          )}
        </div>

        <div className="m-5">
          <h1>Offline users</h1>
          <ul>offline:</ul>
        </div>
        <div className="m-5">
          <h1>Current Games</h1>
          {games && games.length > 0 ? (
            <ul>
              {games.map((game) => (
                <li key={game._id}>
                  {getOpponentUsername(game, currentUserId)}
                  <button onClick={() => navigate(`/game/${game._id}`)}>
                    Join Game
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No games</p>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
