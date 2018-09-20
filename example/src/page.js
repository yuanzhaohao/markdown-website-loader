import React from 'react';
import ReactDOM from 'react-dom';
import Example from './example';

class Page extends React.PureComponent {
  componentDidMount() {
    const { dataSource } = this.props;
    if (dataSource.demos && Object.keys(dataSource.demos)) {
      const children = [];
      const demoData = Object.keys(dataSource.demos)
        .map(key => dataSource.demos[key])
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

      ReactDOM.render(
        children,
        document.getElementById('demos'),
      );
    }
  }

  render() {
    const { dataSource } = this.props;
    console.log(dataSource);
    return (
      <div className="container" dangerouslySetInnerHTML={{
        __html: dataSource.markdown,
      }} />
    );
  }
}

export default Page;