import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter, Switch } from "react-router-dom";

import MainForm from "./components/MainForm";
import Feedback from "./components/Feedback";
import Beta from "./components/Beta";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <Beta/>
        <Switch>
          <Route exact path={"/"} component={MainForm} />
          <Route
            path={"/auth/success"}
            render={props => (
              <Feedback
                {...props}
                message={
                  "Authentication was successful. Please close this window."
                }
                img={"success.svg"}
              />
            )}
          />
          <Route
            path={"/auth/failure"}
            render={props => (
              <Feedback
                {...props}
                message={
                  "There was an issue with the authentication. Please close this window and try again."
                }
                img={"failure.svg"}
              />
            )}
          />
          <Route path={"/"} render={props => <Feedback {...props} message={"The page you are looking for doesn't exist."} img={"empty.svg"} />}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;
