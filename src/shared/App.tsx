import React from "react";
import { Link } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import routes from "./Routes";
import "../less/common.less"
const App = () => {
  return (
    <div className="app">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
      </ul>

      <hr />

      {renderRoutes(routes)}
    </div>
  );
};

export default App;
