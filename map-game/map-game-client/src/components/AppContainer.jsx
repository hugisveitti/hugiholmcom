import React from "react";
import { createStyles, makeStyles, AppBar, Toolbar } from "@material-ui/core";

export const colors = [
  "#52BE80",
  "#DAF7A6",
  "#FFC300",
  "#FF5733",
  "#2C3E50",
  "#5D6D7E",
];
export const backgroundCardColor = "#F9EBEA";

export const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
      minHeight: "100vh",
      position: "relative",
      backgroundColor: "#D1F2EB",
    },
    menuButton: {
      marginRight: 20,
    },
    title: {
      flexGrow: 1,
    },
    header: {
      backgroundColor: colors[0],
    },
    footer: {
      backgroundColor: colors[0],
      fontSize: 10,
      margin: "auto",
      color: "white",
      position: "absolute",
      bottom: 0,
      width: "100%",
      height: "2.5rem",
      padding: 0,
      marginTop: 20,
    },
    footerContent: {
      margin: "auto",
    },
    container: {
      paddingTop: 20,
      paddingBottom: 100,
    },
    buttonGreen: {
      background: colors[0],
      color: "white",
    },
    cardContainer: {
      margin: "auto",
      width: 400,
      backgroundColor: backgroundCardColor,
      textAlign: "center",
      padding: 20,
      marginBottom: 20,
      marginTop: 20,
    },
    icon: {
      width: "auto",
      height: 60,
    },
  })
);
const AppContainer = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.header}>
          <h3>JeoJuessr</h3>
        </Toolbar>
      </AppBar>
      <div className={classes.container}>{children}</div>
      <Toolbar className={classes.footer}>
        <div className={classes.footerContent}>footer stuff</div>
      </Toolbar>
    </div>
  );
};

export default AppContainer;
