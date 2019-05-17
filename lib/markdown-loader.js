'use strict';

const fs = require('fs-extra');
const path = require('path');
const loaderUtils = require('loader-utils');
const md = require('markdown-it')({
  html: true,
});
const glob = require('glob');
const yamlFront = require('yaml-front-matter');
const transformer = require('./transformer');
const defaultOptions = {
  demoFolder: 'demo',
};

module.exports = function(source, options) {
  if (this.cacheable) {
    this.cacheable();
  }

  options = {
    ...defaultOptions,
    options,
  };

  const sourcePath = path.dirname(this.resourcePath);
  const basename = path.basename(this.resourcePath, '.md');
  const demoPath = path.join(sourcePath, options.demoFolder);
  let demos = [];

  if (fs.existsSync(demoPath)) {
    const mdFiles = glob.sync(path.join(demoPath, './*.md'));
    return (
      `module.exports = {` +
      `\n  markdown: ${JSON.stringify(md.render(source))},` +
      `\n demos: {` +
      mdFiles
        .map(filepath => {
          return `'${path.basename(filepath, '.md')}': require(` + `'${filepath}'` + `)`;
        })
        .join(', \n') +
      `}` +
      `};`
    );
  } else {
    const code = getDataCode(source);
    const meta = getDataMeta(source);
    const preview = transformer(code);
    if (meta.subtitle && Object.keys(meta.subtitle).length) {
      Object.keys(meta.subtitle).forEach(key => {
        meta.subtitle[key] = md.render(meta.subtitle[key]);
      });
    }

    return (
      `module.exports = {` +
      `code: ${JSON.stringify(code)},` +
      `meta: ${JSON.stringify(meta)},` +
      `preview: ${preview},` +
      `}`
    );
  }
};

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
