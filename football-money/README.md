## Visualization project

The project is a website using the d3js library.
The project uses a nodejs server.

To run the server locally you must have npm and node installed.
Then type in a terminal:

```
npm i
```

to install the node modules
and then

```
npm run start
```

to start the server. The page should be on localhost:8080.

### The project structure

The server files are index.js and sportdata.js, some basic data processing is done there.

The folder clients/js/ includes all of the d3js stuff.

Usually there is a file called ...Script.js that handles fetching the data and some data processing, then there is some (hopefully) descriptive filenames for what each .js file does that creates plots.

E.g. leagueBarPlot.js, creates the league bar.
