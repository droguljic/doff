// Load modules

const Fs = require('fs');
const Path = require('path');

// Internal logic

Fs.readdirSync(__dirname).forEach((file) => {
  if (file === 'index.js') {
    return; // Skip iteration
  }

  // eslint-disable-next-line global-require
  exports[Path.basename(file, '.js')] = require(Path.join(__dirname, file));
});
