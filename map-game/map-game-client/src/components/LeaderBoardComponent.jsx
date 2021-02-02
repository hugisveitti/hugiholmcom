import React from "react";
import {
  Typography,
  Paper,
  ListItem,
  List,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";
import { ChildCare } from "@material-ui/icons";
import { useStyles } from "./AppContainer";

const LeaderBoardComponent = ({ players, roomName }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.cardContainer}>
      <Typography variant="h6">Players in room {roomName}</Typography>
      <List dense={false} style={{ width: 400, margin: "auto" }}>
        <ListItem>
          <ListItemText inset>Name</ListItemText>
          <ListItemText>Score</ListItemText>
        </ListItem>
        {players.map((player, i) => {
          const listBackgroundColor = i % 2 === 0 ? "#ffeeee" : "inherit";
          return (
            <React.Fragment key={`${player.name}-${i}`}>
              <ListItem style={{ backgroundColor: listBackgroundColor }}>
                {player.isLeader && (
                  <ListItemIcon>
                    <ChildCare />
                  </ListItemIcon>
                )}
                <ListItemText inset={!player.isLeader} primary={player.name} />
                <ListItemText primary={(+player.score).toLocaleString()} />
              </ListItem>
            </React.Fragment>
          );
        })}
      </List>
    </Paper>
  );
};

export default LeaderBoardComponent;
