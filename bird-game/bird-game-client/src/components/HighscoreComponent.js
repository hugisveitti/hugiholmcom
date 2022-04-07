import React, { useEffect, useState } from "react"
import { getLocalBestScore, getTitleFromGameType } from "./utils"



const HighscoreComponent = ({ gameType, data }) => {

    const [bp, setBp] = useState(0)
    useEffect(() => {
        const best = getLocalBestScore(gameType)
        setBp(best)
    }, [])

    const title = getTitleFromGameType(gameType)
    return (
        <div className="center" style={{ marginTop: 15 }}>
            <span style={{ color: "gray", fontSize: 20 }}>
                Þitt besta í {title}leik er {data.pb} stig
            </span>
            <h4>
                25 hæstu stig í {title}leik
            </h4>
            {data.data === undefined ? "Hleður..." :
                <div className="highscore">
                    {data.data.map((d, i) => {
                        return (
                            <div key={`${d.name}-${i}`} className="highscore-item">
                                <span className="highscore-item-name"><span style={{ color: "gray", fontSize: 10 }}>{i + 1}</span> {d.name}</span>
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