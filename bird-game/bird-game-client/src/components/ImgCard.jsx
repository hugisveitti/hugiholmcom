import React from "react";

const ImgCard = ({ card, correct, incorrect, roundOver, onClick }) => {
  let cl = "img";
  if (correct && roundOver) {
    cl += " correct";
  } else if (incorrect && roundOver) {
    cl += " incorrect";
  }

  let url = card.thumb ?? card.imgUrl;

  return (
    <div
      className="img-container"
      onClick={() => {
        onClick();
      }}
    >
      <img src={url} alt="" className={cl} />
    </div>
  );
};

export default ImgCard;
