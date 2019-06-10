<div className="index-page">Markdown-website-loader</div>

## markdown-website-loader

### Installation

```shell
yarn add markdown-website-loader
// or
npm install markdown-website-loader
```

### Usage

```javascript
{
  module: {
    rules: [
      {
        test: /\.md$/,
        loader: ['markdown-website-loader'],
      },
    ];
  }
}
```
