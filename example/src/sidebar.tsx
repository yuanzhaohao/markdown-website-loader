import './sidebar.scss';

import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Layout, Menu } from 'dashkit-ui';
const { Sidebar } = Layout;
const { SubMenu, Item } = Menu;

interface SidebarProps extends RouteComponentProps<any> {
  pages: {
    [key: string]: string;
  };
}

class AppSidebar extends React.PureComponent<SidebarProps> {
  render() {
    const { pages } = this.props;
    return (
      <Sidebar className="sidebar">
        <Menu
          className="sidebar-menu"
          defaultActive="Dashboard"
          defaultOpeneds={['Components']}
          onSelect={this.onMenuSelect}
        >
          <div className="sidebar-logo">
            <div className="sidebar-logo-title">Markdown-website-loader</div>
          </div>

          <Item icon="home" index="Dashboard">
            Dashboard
          </Item>
          <SubMenu icon="book-open" title="Components" index="Components">
            {Object.keys(pages).map(key => (
              <Item key={key} index={key}>
                {pages[key]}
              </Item>
            ))}
          </SubMenu>
        </Menu>
      </Sidebar>
    );
  }

  onMenuSelect = (index: string) => {
    const { pages, location, history } = this.props;
    const page = pages[index] ? pages[index] : `/${index}`;

    if (location.pathname !== page) {
      history.push(page);
    }
  };
}

export default withRouter(AppSidebar);
