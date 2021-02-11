import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import PageComponent from "./PageComponent";
import { Typography, Paper, Link } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    width: "100%",
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: 15,
  },
}));

const pages = [
  {
    name: "Spottaði fugl",
    pageUrl: "http://spottadi-fugl.herokuapp.com/",
    imageUrl: "../images/spottadifugl.PNG",
  },
  {
    name: "JeoJuessr",
    pageUrl: "/jeojuessr",
    imageUrl: "../images/jeojuessricon.png",
  },
  {
    name: "Veður gif",
    pageUrl: "https://twitter.com/vedurgif",
    imageUrl: "../images/vedurgif.PNG",
  },
  {
    name: "Football money",
    pageUrl: "/footballmoney",
    imageUrl: "../images/footballmoney.PNG",
  },
  {
    name: "Letingi",
    pageUrl: "/letingi",
    imageUrl: "../images/letingi.PNG",
  },
];

const FrontPage = () => {
  const classes = useStyles();
  const xsSize = 6;
  const smSize = 4;
  return (
    <Grid container className={classes.root} spacing={2}>
      {pages.map((page) => (
        <PageComponent
          pageUrl={page.pageUrl}
          imageUrl={page.imageUrl}
          xsSize={xsSize}
          smSize={smSize}
          key={page.pageUrl}
        />
      ))}
      <Grid item xs={12}>
        <Paper
          style={{
            margin: "auto",
            width: 300,
            padding: 15,
            backgroundColor: "#eee",
            marginTop: 25,
          }}
        >
          <Typography>
            My name is Hugi Holm I am a Computer Science student. I am not sure
            what I will do with this website. I have some small personal
            projects I have done in the past and will probably fill the website
            with them.
          </Typography>
          <Typography>
            Most of these are on my{" "}
            <Link href="http://github.com/hugisveitti">Github</Link>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default FrontPage;
