import React, { useState, useEffect } from "react";
import { getHighscores, saveHighscore } from "../firebaseFunctions";
import GameOverComponent from "./GameOverComponent";
import GameTypeSelect from "./GameTypeSelect";
import HighscoreComponent from "./HighscoreComponent";
import ImgGame from "./ImgGame";

const FrontPage = () => {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameType, setGameType] = useState("");

  const [birdData, setBirdData] = useState(undefined);
  const [plantData, setPlantData] = useState(undefined);

  const handleGetHi = (_gameType) => {
    getHighscores(_gameType).then((d) => {
      if (_gameType === "bird") {
        setBirdData(d);
      } else if (_gameType === "plant") {
        setPlantData(d);
      }
    });
  };

  useEffect(() => {
    handleGetHi("bird");
    handleGetHi("plant");
  }, []);

  const renderGame = () => {
    if (gameType !== "") {
      return (
        <>
          <ImgGame
            setScore={setScore}
            gameOver={(_score) => {
              setGameOver(true);
              setScore(_score);
            }}
            gameType={gameType}
          />
          <div className="center">
            <button
              onClick={() => {
                setGameOver(true);
              }}
              className="btn"
            >
              Hætta leik
            </button>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div className="container">
      <h3 className="center">Fugla leikurinn</h3>
      {gameOver ? (
        <GameOverComponent
          score={score}
          saveScore={(name) => {
            if (name.length > 16) {
              name = name.slice(0, 16);
            }
            if (score === 0) return;
            if (gameType === "bird") {
              setBirdData(undefined);
            } else {
              setPlantData(undefined);
            }
            saveHighscore(gameType, score, name).then(() => {
              handleGetHi(gameType);
            });
            setGameType("");
            setGameOver(false);
            setScore(0);
          }}
        />
      ) : (
        <>{renderGame()}</>
      )}
      {
        <GameTypeSelect
          onSelect={(g) => {
            setScore(0);
            setGameOver(false);
            setGameType(g);
          }}
        />
      }

      <HighscoreComponent gameType={"bird"} data={birdData} />
      <HighscoreComponent gameType={"plant"} data={plantData} />
    </div>
  );
};

export default FrontPage;
