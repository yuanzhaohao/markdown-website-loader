import React from 'react';
import ReactDOM from 'react-dom';
import data from '../docs/input/en-US.md';
import Example from './example';

console.log(data);

import './index.css';

class App extends React.Component {
  componentDidMount() {
    if (data.demos && Object.keys(data.demos)) {
      const children = [];
      const demoData = Object.keys(data.demos)
        .map(key => data.demos[key])
        .sort((a, b) => a.meta.order - b.meta.order);
        
      demoData.forEach((d, key) => {
        const child = (
          <Example 
            key={key} 
            dataSource={d}
          />
        );
        children.push(child);
      });
      
      console.log(demoData);
      ReactDOM.render(
        children,
        document.getElementById('demos'),
      );
    }
  }

  render() {
    return (
      <div className="container" dangerouslySetInnerHTML={{
        __html: data.markdown,
      }} />
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
