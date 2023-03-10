const path = require('path');

module.exports = {
  // preset: 'jest-puppeteer',
  moduleNameMapper: {
    "^@/(.*)": `${__dirname}/src/$1`,
    'aseat-core':path.resolve(__dirname, 'src/index'),
    'aseat-canvas-grid-layer':path.resolve(__dirname, 'src/layer/grid/CanvasGridLayer'),
    'aseat-canvas-layer':path.resolve(__dirname, 'src/layer/CanvasLayer'),
    'aseat-svg-layer':path.resolve(__dirname, 'src/layer/SvgLayer'),
    'aseat-html-layer':path.resolve(__dirname, 'src/layer/HtmlLayer'),
    "^.+\\.(css|less|scss)$": "identity-obj-proxy",
  },
};

