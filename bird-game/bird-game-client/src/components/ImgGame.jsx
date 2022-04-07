import React, { useEffect, useState } from "react";
import ImgCard from "./ImgCard";
import {
  getDataFromGameType,
  getGeoQuestionFromCategory,
  itemInArray,
  randomInt,
  shuffle,
} from "./utils";

let score = 0;
let total = 0;
let data = [];
let allIdx = [];

const ImgGame = ({ gameOver, gameType, setScore, setTotal, percentPlay }) => {
  const [activeIdx, setActiveIdx] = useState([]);
  const [roundOver, setRoundOver] = useState(false);

  const [active, setAcitve] = useState(0);
  const [incorrect, setIncorrect] = useState(-1);

  useEffect(() => {
    if (gameType === "") return;
    let _data = getDataFromGameType(gameType);

    shuffle(_data);
    let delCount = Math.floor(_data.length * (percentPlay / 100));

    delCount = Math.max(delCount, 10);
    _data = _data.splice(0, delCount);

    let _allIdx = [];
    _allIdx = [];
    for (let i = 0; i < _data.length; i++) {
      _allIdx.push(i);
    }
    data = _data;
    allIdx = _allIdx;
    score = 0;
    setScore(0);
    setTotal(0);
    total = 0;
    nextRound();
  }, [gameType, percentPlay]);

  const sameCategory = (num1, num2) => {
    if (gameType === "plant") {
      return true;
    }

    return data[num1]["category"] === data[num2]["category"];
  };

  const nextRound = () => {
    if (data.length === 0) return;
    let a = [];
    a.push(allIdx[0]);

    for (let i = 0; i < 3; i++) {
      let e = randomInt(data.length);
      let numWrong = 0;
      while (
        (itemInArray(e, a) || !sameCategory(e, allIdx[0])) &&
        numWrong < 20
      ) {
        e = randomInt(data.length);
        numWrong += 1;
      }
      a.push(e);
    }
    setAcitve(allIdx[0]);
    shuffle(a);
    setActiveIdx(a);
  };

  const handleGameOver = () => {
    setRoundOver(true);
    gameOver(score, total);
  };

  const roundFinished = () => {
    allIdx.splice(0, 1);
    if (allIdx?.length === 0) {
      handleGameOver();
    } else {
      setIncorrect(-1);
      setRoundOver(false);
      nextRound();
    }
  };

  useEffect(() => {
    shuffle(allIdx);
    nextRound();
  }, []);

  // const da = data.filter((d) => d.category3 === "Asteraceae");

  let leftText = "";
  let question = "";
  let nextText = "";
  if (gameType === "plant") {
    leftText = "plöntur";
    question = "planta";
    nextText = "Næsta planta";
  } else if (gameType === "bird") {
    leftText = "fuglar";
    question = "fugl";
    nextText = "Næsti fugl";
  } else if (gameType === "geo") {
    leftText = "spurningar";
    nextText = "Næsta spurning";
    question =
      data.length > 0
        ? getGeoQuestionFromCategory(data[allIdx[0]].category)
        : "";
  }

  return (
    <div>
      <div className="imgs-container">
        {/* {da.map((d) => (
          <ImgCard card={d} key={`iad-${d.name}`} onClick={() => {}} />
        ))} */}
        <span
          style={{ width: "25%", display: "inline-block", textAlign: "left" }}
        >
          {allIdx?.length ?? 0} {leftText} eftir
        </span>
        <span
          style={{
            width: "50%",
            display: "inline-block",
            textAlign: "center",
            fontSize: 22,
            fontWeight: "bold",
          }}
        >
          Hvaða {question} er {data[active]?.name ?? "unkno"}?
        </span>
        <span
          style={{ width: "25%", display: "inline-block", textAlign: "right" }}
        >
          Stig {score} / {total}
        </span>
        <div style={{ marginBottom: 15 }}></div>

        {activeIdx.map((i, num) => (
          <ImgCard
            key={`${i}-img-${num}`}
            card={data[i]}
            roundOver={roundOver}
            correct={i === active}
            incorrect={incorrect === i}
            onClick={() => {
              if (roundOver) {
                roundFinished();
                return;
              }
              if (i === active) {
                score++;
                setScore(score);
              } else {
                setIncorrect(i);
              }
              total++;

              setRoundOver(true);
            }}
          />
        ))}

        <div
          className={`center ${roundOver ? "" : "hide"}`}
          style={{ marginBottom: 15 }}
        >
          <button className={`btn `} onClick={() => roundFinished()}>
            {allIdx.length === 1 ? "Ljúka leik" : nextText}
          </button>
          <br />
          <span
            style={{
              borderRadius: 10,
              padding: 5,
              backgroundColor:
                incorrect === -1 ? "rgba(0,255,0, .3)" : "rgba(255,0,0, .3)",
            }}
          >
            {incorrect === -1 ? "Rétt!" : "Rangt"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImgGame;
