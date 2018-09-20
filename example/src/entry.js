import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, Redirect, NavLink } from 'react-router-dom';
import asyncComponent from './async-component';
import Header from './header';

const IndexPage = asyncComponent(() => import('./index'));
const InputPage = asyncComponent(() => import('../docs/input/en-US.md'));
const ButtonPage = asyncComponent(() => import('../docs/button/en-US.md'));

const App = () => (
  <HashRouter>
    <div>
      <Header />
      <div className="app-content">
        <Switch>
          <Route exact path="/" component={IndexPage} />
          <Route exact path="/input" component={InputPage} />
          <Route exact path="/button" component={ButtonPage} />
          <Redirect to="/" />
        </Switch>
      </div>
    </div>
  </HashRouter>
)

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
