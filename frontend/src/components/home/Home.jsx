import React, { useEffect } from "react";
import { useStore } from "../../zustand/store";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbars/Navbar";
import leftImage from "../../assets/background/background-one.png";
import rightImage from "../../assets/background/background-two.png";
import rightImageTwo from "../../assets/background/background-three.png";
import leftImageTwo from "../../assets/background/background-four.png";

const HomePage = () => {
  const logState = useStore((state) => state.logState);
  const currentUser = useStore((state) => state.user);
  const users = useStore((state) => state.users);

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

  useEffect(() => {
    fetchUsers();
    fetchUserGames();
  }, []);

  logState();

  return (
    <>
      <Navbar />

      <div className="content-main-page text-light">
        <div className="section-one">
          <div className="text-center w-50">
            <h1 className="display-3">
              Welcome{" "}
              <span className="test display-3">{currentUser.username}</span>
            </h1>
            <h3 className="display-5 text-center mt-5">
              Test your chess skills here. No signup, no details.
              <br /> Just Chess.
            </h3>
          </div>
          <div className="images-box">
            <img src={leftImage} alt="Left" className="background-image" />
            <img src={rightImage} alt="Right" className="background-image" />
          </div>
        </div>

        <div className="section-two">
          <div className="half-section d-flex justify-content-between w-50">
            <div className="half-section-one">
              <h2>Start a new game</h2>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user._id}
                    className="d-flex justify-content-between m-3"
                  >
                    <span className="mt-2">{user.username}</span>
                    <button
                      className="btn btn-warning"
                      onClick={async () => {
                        const gameId = await createGame(user._id);
                        navigate(`/game/${gameId}`);
                      }}
                    >
                      Challenge
                    </button>
                  </div>
                ))
              ) : (
                <h1>No users</h1>
              )}
            </div>{" "}
            <div className="half-section-two">
              <h2>Continue where you left off!</h2>
              {games && games.length > 0 ? (
                games.map((game) => (
                  <div
                    key={game._id}
                    className="d-flex justify-content-between m-3"
                  >
                    <span className="mt-2">
                      {getOpponentUsername(game, currentUserId)}
                    </span>
                    <button
                      className="btn btn-success"
                      onClick={() => navigate(`/game/${game._id}`)}
                    >
                      Resume
                    </button>
                  </div>
                ))
              ) : (
                <h1>No current games</h1>
              )}
            </div>
          </div>
          <div className="images-box">
            <img src={leftImageTwo} alt="Left 2" className="background-image" />
            <img
              src={rightImageTwo}
              alt="Right 2"
              className="background-image"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
