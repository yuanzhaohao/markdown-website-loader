import React from 'react';
import ReactDOM from 'react-dom';
import dataSource from './test.md';
import Example from './example';

console.log(dataSource);

import './index.css';

class App extends React.Component {
  render() {
    const { demos } = dataSource;
    return (
      <div className="container">
        <div className="basic" dangerouslySetInnerHTML={{
          __html: dataSource.markdown,
        }} />
        <div className="demos">{demos.map((demo, key) => 
          <Example key={key} dataSource={demo} />
        )}</div>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
