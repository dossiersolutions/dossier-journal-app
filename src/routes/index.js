import React from "react";
import {BrowserRouter, Route} from "react-router-dom";
import Users from "../UI/content/Users";
import Home from "../UI/content/Home";

import Channel from "../UI/content/Channel"

export default () =>(<BrowserRouter>
      <div>
      <Route path="/" exact component={Home}/>
      <Route path="/users" exact component={Users}/>
      <Route path="/channel/:channelId" exact component={Channel}/>
      </div>
    </BrowserRouter>
)