import React from "react";
import ReactDOM from "react-dom";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import "./styles.css";
import Provider from "./provider";
import List from "./components/List";
import Layout from "./components/Layout";

function App() {
  return (
    <Provider>
      <Layout>
        <Switch>
          <Route exact path="/" component={List} />
        </Switch>
      </Layout>
    </Provider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  rootElement
);
