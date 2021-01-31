import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";
import "./App.css";

function App() {
  return (
    <BrowserRouter basename="/map-game">
      <Routes />
    </BrowserRouter>
  );
}

export default App;
