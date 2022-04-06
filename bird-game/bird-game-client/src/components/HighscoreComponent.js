import React from "react"

const HighscoreComponent = ({ gameType, data }) => {

    const title = gameType === "bird" ? "fugla" : "plöntu"
    return (
        <div className="center">
            <h4>
                Hæstu stig í {title} leik
            </h4>
            {data === undefined ? "Hleður..." :
                <div className="highscore">
                    {data.map((d, i) => {
                        return (
                            <div key={`${d.name}-${i}`} className="highscore-item">
                                <span className="highscore-item-name">{d.name}</span>
                                <span className="highscore-item-score">{d.score}</span>
                            </div>
                        )
                    })}
                </div>
            }

        </div>
    )
}

export default HighscoreComponent