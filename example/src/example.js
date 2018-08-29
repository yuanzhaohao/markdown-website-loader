import React from 'react';

class Example extends React.PureComponent {
  constructor(props) {
    super(props);
    this.contentKey = `${(Math.random() * 1e9).toString(36)}`;
    this.state = {
      showCode: false,
    };
  }
  render() {
    const { dataMeta, dataCode, previewer } = this.props.dataSource;
    const { showCode } = this.state;

    return (
      <div className="example">
        <div className="example-content" ref={this.contentKey}>{previewer()}</div>
        <div className="example-info">
          {dataMeta.title ? <div className="example-title">{dataMeta.title}</div> : null}
          {dataMeta.subtitle
            ? <div className="example-subtitle" dangerouslySetInnerHTML={{
                __html: dataMeta.subtitle,
              }} />
            : null
          }
          <span className="example-control" onClick={this.onControlClick}>{showCode ? '-' : '+'}</span>
        </div>
        {showCode
          ? <pre className="example-code">
            <code className="language-jsx" ref="code">{dataCode}</code>
          </pre>
          : null
        }
      </div>
    )
  }

  onControlClick = () => {
    const { showCode } = this.state;
    const newValue = !showCode
    this.setState({
      showCode: newValue,
    });
    setTimeout(() => {
      if (newValue && this.refs.code) {
        window.Prism.highlightElement(this.refs.code);
      }
    }, 0);
  }
}

export default Example;
