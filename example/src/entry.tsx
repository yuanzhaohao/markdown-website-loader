import './index.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Layout } from 'dashkit-ui';
import CommonSidebar from './sidebar';
// import asyncComponent from './async-component';
import routes from './routes';
import Page from './page';
const { Content, Footer } = Layout;
let pages = {};
Object.keys(routes)
  .filter(v => v !== 'components')
  .forEach(key => {
    pages[key] = routes[key];
  });
pages = {
  ...pages,
  ...routes.components,
};

const App = () => (
  <HashRouter>
    <Layout>
      <CommonSidebar pages={routes.components} />
      <Layout className="app-layout">
        <Content className="app-content">
          <Switch>
            {Object.keys(pages).map(key => (
              <Route
                exact
                key={key}
                path={key}
                render={() => <Page route={pages[key]} locale="en-US" />}
              />
            ))}
            <Redirect to="/" />
          </Switch>
        </Content>
        <Footer className="app-footer">Powered by Yuan Zhaohao</Footer>
      </Layout>
    </Layout>
  </HashRouter>
);

ReactDOM.render(<App />, document.getElementById('app'));
