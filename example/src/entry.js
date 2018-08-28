import React from 'react';
import ReactDOM from 'react-dom';
import marked from 'marked';
import dataSource from './test.md';
import Example from './example';

console.log(dataSource);

import './index.css';

class App extends React.Component {
  // componentDidMount() {
  //   const { example } = dataSource;
  //   console.log(example);
  //   for (const key in example) {
  //     const div = document.getElementById(key);
  //     const Element = React.createElement(Example, {
  //       dataSource: example[key],
  //     });
  //     ReactDOM.render(Element, div);
  //   }
  // }

  render() {
    const { demos } = dataSource;
    return (
      <div className="container">
        <div className="basic" dangerouslySetInnerHTML={{
          __html: marked(dataSource.markdown, { renderer: new marked.Renderer })
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
