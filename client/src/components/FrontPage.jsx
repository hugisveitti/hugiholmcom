import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import PageComponent from "./PageComponent";
import { Typography, Paper, Link, Divider } from "@material-ui/core";

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
    name: "Collisio",
    pageUrl: "https://www.collisio.club",
    imageUrl: "../images/collisio2.png",
    cardText:
      "A racing game. Use your phone to steer a car displayed on your computer. I create all the models used in the game.",
  },
  {
    name: "Fill in the Quote",
    pageUrl: "/quote",
    imageUrl: "../images/quotes.png",
    cardText:
      "A simple text game I created to learn to program in the Flutter environment.",
  },
  {
    name: "Spottaði fugl",
    pageUrl: "https://spottadi-fugl.herokuapp.com/",
    imageUrl: "../images/spottadifugl.PNG",
    cardText:
      "An online bird diary. I received a small grant from the Icelandic ministry of the Environment to develop this site.",
  },
  {
    name: "Bird game",
    pageUrl: "/fuglar",
    imageUrl: "../images/birds.jpg",
    cardText:
      "Another bird related project. Simple game to learn the birds of Iceland. No real point to this project.",
  },
  {
    name: "JeoJuessr",
    pageUrl: "/jeojuessr",
    imageUrl: "../images/jeojuessricon.png",
    cardText:
      "A weekend project of mine, a free version of the game GeoGuessr using open source technologies. It is possible to play with friends.",
  },
  {
    name: "Veður gif",
    pageUrl: "https://twitter.com/vedurgif",
    imageUrl: "../images/vedurgif.PNG",
    cardText:
      "Twitterbot that creates a GIF of the weather predictions of Iceland as their webpage is annoying to navigate on mobile.",
  },
  {
    name: "Football money",
    pageUrl: "/footballmoney",
    imageUrl: "../images/footballmoney.PNG",
    cardText:
      "Project I did in a course on data visualization. Its about money in football.",
  },
  {
    name: "Letingi",
    pageUrl: "/letingi",
    imageUrl: "../images/letingi.PNG",
    cardText: "A website I created for a friend who wanted to sell his fonts.",
  },
  {
    name: "Flag game",
    pageUrl: "/flaggame",
    imageUrl: "../images/flaggame.PNG",
    cardText: "First website I created, a simple flag game.",
  },
  // {
  //   name: "Colors",
  //   pageUrl: "/colors",
  //   imageUrl: "../images/colors.PNG",
  // },
  {
    name: "Jón Sigurðsson timeline",
    pageUrl: "https://jonshus.dk/timalina/",
    imageUrl: "../images/jonsig.PNG",
    cardText:
      "Project I did for the government of Iceland. Converting an old adobe flash application to a website.",
  },
];



const FrontPage = () => {
  const classes = useStyles();
  const xsSize = 12;
  const smSize = 4;
  const lgSize = 3;
  return (
    <Grid container className={classes.root} spacing={0}>
 
      {pages.map((page) => (
        <PageComponent
          pageUrl={page.pageUrl}
          imageUrl={page.imageUrl}
          xsSize={xsSize}
          smSize={smSize}
          lgSize={lgSize}
          key={page.pageUrl}
          cardText={page.cardText}
          cardTitle={page.name}
        />
      ))}
        <Grid item xs={12}  />

        <Grid item xs={1} lg={3} />
      <Grid item xs={10} lg={6}>
        <Paper
          style={{
            margin: "auto",

            padding: 15,
            backgroundColor: "#eee",
            marginTop: 25,
          }}
        >
          <Typography>
            My name is Hugi Holm, I work as a fullstack developer at HorseDay. I hold a MSc in Computer Science from the University of Copenhagen.
          </Typography>
          <br />
          <Divider />
          <br />
          <Typography>
            I am interested in Machine Learning, I did my Master's thesis where
            the topic was{" "}
            <Link href="https://en.wikipedia.org/wiki/Generative_adversarial_network">
              GANs
            </Link>
            . I am also interested in frontend development, I worked part-time
            along with my studies as a React developer, and I am interested in
            learning more backend, that is more than throwing together a nodejs
            sever. Most of my studies have focused on computational science,
            algorithms and machine learning.
          </Typography>
          <br />
          <Divider />
          <br />
          <Typography>
            On this site are some side-projects I have played with. Most of
            these are on my{" "}
            <Link href="http://github.com/hugisveitti">Github</Link>.
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={1} lg={3} />
    </Grid>
  );
};

export default FrontPage;
