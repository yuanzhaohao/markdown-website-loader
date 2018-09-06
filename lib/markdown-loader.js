'use strict';

const path = require('path');
const loaderUtils = require('loader-utils');
const md = require('markdown-it')({
  html: true,
});
const glob = require('glob');

module.exports = function (source) {
  if (this.cacheable) {
    this.cacheable();
  }
  const options = loaderUtils.getOptions(this) || {};
  const sourcePath = path.dirname(this.resourcePath);
  const demoComplier = path.join(__dirname, './demo-complier.js');
  const mdFiles = glob.sync(path.join(sourcePath, './*.md'), {
    ignore: [
      path.join(sourcePath, 'en-US.md'), 
      path.join(sourcePath, 'zh-CN.md'),
    ]
  });

  source = source.replace(/<Demos\s?\/>/g, '<div id="demos" />');

  return `module.exports = {` +
    `\n  markdown: ${JSON.stringify(md.render(source))},` +
    `\n demos: {` +
      mdFiles.map(filepath => {
        return `'${path.basename(filepath, '.md')}': ` + 
          `require('${demoComplier}!${filepath}')`;
      }).join(', \n') +
    `}` +
  `};`;
}