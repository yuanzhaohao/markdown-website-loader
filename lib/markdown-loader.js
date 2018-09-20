'use strict';

const path = require('path');
const loaderUtils = require('loader-utils');
const md = require('markdown-it')({
  html: true,
});
const glob = require('glob');
const yamlFront = require('yaml-front-matter');
const transformer = require('./transformer');

module.exports = function (source) {
  if (this.cacheable) {
    this.cacheable();
  }

  const options = Object.assign({
    originFileName: ['en-US', 'zh-CN']
  }, loaderUtils.getOptions(this));
  const sourcePath = path.dirname(this.resourcePath);
  const basename = path.basename(this.resourcePath, '.md');

  if (options.originFileName.indexOf(basename) !== -1) {
    const mdFiles = glob.sync(path.join(sourcePath, './*.md'), {
      ignore: options.originFileName.map(name => path.join(sourcePath, `${name}.md`))
    });

    source = source.replace(/<Demos\s?\/>/g, '<div id="demos"></div>');

    return `module.exports = {` +
      `\n  markdown: ${JSON.stringify(md.render(source))},` +
      `\n demos: {` +
      mdFiles.map(filepath => {
        return (
          `'${path.basename(filepath, '.md')}': require(` +
          `'${filepath}'` +
          `)`
        );
      }).join(', \n') +
      `}` +
      `};`;

  } else {

    const code = getDataCode(source);
    const meta = getDataMeta(source);
    const preview = transformer(code);
    if (meta.subtitle && Object.keys(meta.subtitle).length) {
      Object.keys(meta.subtitle).forEach(key => {
        meta.subtitle[key] = md.render(meta.subtitle[key]);
      });
    }

    return `module.exports = {` +
      `code: ${JSON.stringify(code)},` +
      `meta: ${JSON.stringify(meta)},` +
      `preview: ${preview},` +
      `}`;
  }
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
