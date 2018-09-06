'use strict';

const md = require('markdown-it')({
  html: true,
});
const yamlFront = require('yaml-front-matter');
const transformer = require('./transformer');

module.exports = function (source) {
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
