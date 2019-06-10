import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RouteComponentProps } from 'react-router-dom';
import { Spin, Grid } from 'dashkit-ui';
import Example from './example';
const { Row, Col } = Grid;

type PageProps = {
  route: string;
  locale: string;
};

type PageState = {
  dataSource?: {
    markdown: string;
    demos: Object[];
  } | null;
};

class Page extends React.Component<PageProps, PageState> {
  constructor(props: PageProps) {
    super(props);
    this.state = {
      dataSource: null,
    };
  }

  async componentDidMount() {
    const { route, locale } = this.props;
    const dataSource = await import(`../docs/${route}/${locale}.md`);

    this.setState({
      dataSource,
    });
    const demoElement = document.getElementById('demos');

    if (demoElement && dataSource.demos && Object.keys(dataSource.demos)) {
      const demoData = Object.keys(dataSource.demos)
        .map(key => dataSource.demos[key])
        .sort((a, b) => a.meta.order - b.meta.order);
      const children = demoData.map((d, key) => {
        return <Example key={key} locale={locale} dataSource={d} />;
      });
      ReactDOM.render(children, demoElement);
    }
  }

  render() {
    const { dataSource } = this.state;

    return (
      <Grid className="app-page" fluid>
        <Row center="xs">
          <Col xs={12} md={10} lg={8}>
            {dataSource && dataSource.markdown ? (
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
            )}
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Page;
