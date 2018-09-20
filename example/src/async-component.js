import React from 'react';
import Page from './page';
import 'babel-polyfill';

export default function asyncComponent(importComponent) {
  class AsyncComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        result: null
      };
    }

    async componentDidMount() {
      const result = await importComponent();

      console.log(result);
      this.setState({
        result,
      });
    }

    render() {
      const { result } = this.state;
      if (result) {
        return (
          result.default
            ? <result.default />
            : <Page dataSource={result} />
        );
      }
      return (
        <div className="page-loading">
          Loading...
        </div>
      );
    }
  }

  return AsyncComponent;
}
