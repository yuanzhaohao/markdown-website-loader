import React from 'react';
import ReactDOM from 'react-dom';
import mdData from './test.md';

import './index.css';

class App extends React.Component {
  render() {
    return (
      <div className="test">test</div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
