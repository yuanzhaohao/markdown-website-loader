import * as React from 'react';
import { Spin } from 'dashkit-ui';

class Index extends React.PureComponent {
  state = {
    dataSource: null,
  };
  async componentDidMount() {
    const dataSource = await import(`../docs/index.md`);
    console.log(dataSource);
    this.setState({
      dataSource,
    });
  }
  render() {
    const { dataSource } = this.state;

    return dataSource && dataSource.markdown ? (
      <div
        className="app-page-info"
        dangerouslySetInnerHTML={{
          __html: dataSource.markdown,
        }}
      />
    ) : (
      <div className="page-loading">
        <Spin text="Loading..." spinning={true} />
      </div>
    );
  }
}

export default Index;
