import "./App.css";
import Login from "./containers/login";
import Home from "./containers/home";
import { Route, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">
     
        <Switch>
          <Route  exact path="/">
            <Login />
          </Route>
          <Route path="/home">
            <Home />
          </Route>
        </Switch>
    </div>
  );
}

export default App;
