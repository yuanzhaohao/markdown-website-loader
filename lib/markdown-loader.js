'use strict';

const fs = require('fs-extra');
const path = require('path');
const md = require('markdown-it')({
  html: true,
});
const glob = require('glob');
const yaml = require('js-yaml');
const loaderUtils = require('loader-utils');
const transformer = require('./transformer');
const defaultOptions = {
  demoFolder: 'demo',
  babelConfig: {},
};

module.exports = function(source) {
  this.cacheable && this.cacheable();

  const options = Object.assign({}, defaultOptions, loaderUtils.getOptions(this));
  const callback = this.async();

  const params = this.resourceQuery === '' ? {} : loaderUtils.parseQuery(this.resourceQuery);
  const sourcePath = path.dirname(this.resourcePath);

  if (!params.isDemo) {
    const demoPath = path.join(sourcePath, options.demoFolder);
    const mdFiles = glob.sync(path.join(demoPath, './*.md'));
    const demoString = mdFiles
      .map(filepath => {
        return (
          `'${path.basename(filepath, '.md')}': require(` +
          loaderUtils.stringifyRequest(this, `${filepath}?+isDemo`) +
          `)`
        );
      })
      .join(', \n');

    callback(
      null,
      `module.exports = {` +
        `\n markdown: ${JSON.stringify(md.render(source))},` +
        `\n demos: {\n${demoString}\n},` +
        `};`,
    );
  } else {
    callback(null, transformDemo(source, options.babelConfig));
  }
};

function transformDemo(source, babelConfig) {
  const code = getDataCode(source);
  const meta = yamlFront(source);
  const preview = transformer(code, babelConfig);
  if (meta && meta.subtitle && Object.keys(meta.subtitle).length) {
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

function getDataCode(markdownText) {
  if (markdownText) {
    const reg = /```(.*)[js|javascript]\s?([^]+?)```/;
    const sourceMatch = markdownText.match(reg);
    if (sourceMatch && sourceMatch.length && sourceMatch[2]) {
      return sourceMatch[2];
    }
  }
  return '';
}

function yamlFront(markdownText, options, loadSafe) {
  let contentKeyName =
    options && typeof options === 'string'
      ? options
      : options && options.contentKeyName
      ? options.contentKeyName
      : '__content';
  let passThroughOptions = options && typeof options === 'object' ? options : undefined;
  let result = {};
  const reg = /---(.*)\s?([^]+?)---/;
  const metaMatch = reg.exec(markdownText);
  if (metaMatch && metaMatch.length) {
    const yamlOrJson = metaMatch[2];

    if (yamlOrJson.charAt(0) === '{') {
      result = JSON.parse(yamlOrJson);
    } else {
      if (loadSafe) {
        result = yaml.safeLoad(yamlOrJson, passThroughOptions);
      } else {
        result = yaml.load(yamlOrJson, passThroughOptions);
      }
    }
  }
  return result;
}
