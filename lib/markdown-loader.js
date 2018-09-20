'use strict';

const path = require('path');
const fs = require('fs');
const md = require('markdown-it')({
  html: true,
});
const yamlFront = require('yaml-front-matter');
const transformer = require('./transformer');
const glob = require('glob');

module.exports = function (source) {
  if (this.cacheable) {
    this.cacheable();
  }
  const sourcePath = path.dirname(this.resourcePath);
  const mdFiles = glob.sync(path.join(sourcePath, './*.md'), {
    ignore: [
      path.join(sourcePath, 'en-US.md'),
      path.join(sourcePath, 'zh-CN.md'),
    ]
  });

  source = source.replace(/<Demos\s?\/>/g, '<div id="demos"></div>');

  return `module.exports = {` +
    `\n  markdown: ${JSON.stringify(md.render(source))},` +
    `\n demos: {` +
      mdFiles.map(filepath => {
        const demoSource = fs.readFileSync(filepath, 'utf8');
        const code = getDataCode(demoSource);
        const meta = getDataMeta(demoSource);
        const preview = transformer(code);
        if (meta.subtitle && Object.keys(meta.subtitle).length) {
          Object.keys(meta.subtitle).forEach(key => {
            meta.subtitle[key] = md.render(meta.subtitle[key]);
          });
        }
        return (
          `'${path.basename(filepath, '.md')}': {` +
            `code: ${JSON.stringify(code)},` +
            `meta: ${JSON.stringify(meta)},` +
            `preview: ${preview},` +
          `}`
        );
      }).join(', \n') +
    `}` +
  `};`;
}


function getDataCode(markdownText) {
  if (markdownText) {
    const reg = /```(.*)js\s?([^]+?)```/;
    const sourceMatch = markdownText.match(reg);
    if (sourceMatch && sourceMatch.length && sourceMatch[2]) {
      return sourceMatch[2];
    }
  }
  return '';
}

function getDataMeta(markdownText) {
  if (markdownText) {
    const reg = /---(.*)\s?([^]+?)---/;
    const metaMatch = markdownText.match(reg);
    if (metaMatch && metaMatch.length) {
      return yamlFront.loadFront(metaMatch[0]);
    }
  }
  return {};
}
