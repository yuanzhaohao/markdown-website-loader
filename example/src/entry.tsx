import './index.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Layout } from 'dashkit-ui';
import CommonSidebar from './sidebar';
import asyncComponent from './async-component';
import Page from './page';
const { Content, Footer } = Layout;
const IndexPage = asyncComponent(() => import('./index'));
const pages = ['checkbox', 'button', 'grid', 'menu', 'message', 'pagination'];

const App = () => (
  <HashRouter>
    <Layout>
      <CommonSidebar pages={pages} />
      <Layout className="app-layout">
        <Content className="app-content">
          <Switch>
            <Route exact path="/" component={IndexPage} />
            {pages.map(page => (
              <Route key={page} exact path={`/${page}`} component={Page} />
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
