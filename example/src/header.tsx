
import './header.scss';

import * as React from 'react';
import * as classNames from 'classnames';
import { Link } from 'react-router-dom';

class Header extends React.Component {

  render() {
    const pages = [
      {
        name: 'Button',
        route: '/button',
      },
      {
        name: 'Input',
        route: '/input',
      }
    ];
    return (
      <div className="app-header">
        {pages.map(page =>
          <Link
            key={page.route}
            to={page.route}
            className={
              classNames('navbar-item', {
                'navbar-item-active': location.hash.indexOf(page.route) !== -1,
              })
            }
          >
            {page.name}
          </Link>
        )}
      </div>
    );
  }
}

export default Header;