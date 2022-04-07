import React, { useState, useEffect } from "react";
import { getHighscores, saveHighscore } from "../firebaseFunctions";
import DonationBtn from "./DontationBtn";
import GameOverComponent from "./GameOverComponent";
import GameTypeSelect from "./GameTypeSelect";
import HighscoreComponent from "./HighscoreComponent";
import ImgGame from "./ImgGame";
import { getLocalBestScore, saveLocalBestScore } from "./utils";

const percentPlayKey = "percentPlay";
const FrontPage = () => {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [gameType, setGameType] = useState("");

  const [birdData, setBirdData] = useState({
    data: undefined,
    pb: getLocalBestScore("bird"),
  });
  const [plantData, setPlantData] = useState({
    data: undefined,
    pb: getLocalBestScore("plant"),
  });

  const [perc, setPerc] = useState(
    window.localStorage.getItem(percentPlayKey) ?? 100
  );

  const handleGetHi = (_gameType) => {
    getHighscores(_gameType).then((d) => {
      const pb = getLocalBestScore(_gameType);
      if (_gameType === "bird") {
        setBirdData({
          data: d,
          pb,
        });
      } else if (_gameType === "plant") {
        setPlantData({ data: d, pb });
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
            setTotal={setTotal}
            gameOver={(_score, _total) => {
              setGameOver(true);
              setScore(_score);
              setTotal(_total);
            }}
            gameType={gameType}
            percentPlay={perc}
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
            const setPB = saveLocalBestScore(gameType, score);
            let pb = getLocalBestScore(gameType);
            if (setPB) {
              pb = score;
            }
            if (gameType === "bird") {
              setBirdData({ data: undefined, pb });
            } else {
              setPlantData({ data: undefined, pb });
            }
            saveHighscore(gameType, score, total, name).then(() => {
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
          perc={perc}
          setPerc={(val) => {
            setPerc(val);
            window.localStorage.setItem(percentPlayKey, val);
          }}
        />
      }

      <DonationBtn />

      <HighscoreComponent gameType={"bird"} data={birdData} />
      <HighscoreComponent gameType={"plant"} data={plantData} />
    </div>
  );
};

export default FrontPage;
