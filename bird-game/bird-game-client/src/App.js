import './App.css';
import FrontPage from './components/FrontPageComponent';
import IslandFrontPage from './components/island/IslandFrontpage';

function App() {

  const path = window.location.pathname
  console.log("paht", path)
  if (path === "/island") {
    return <IslandFrontPage />
  }

  return (
    <FrontPage />
  );
}

export default App;
