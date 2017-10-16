// Internal logic

const SYMBOL_NAME_REGEX = /Symbol\((.*)\)/;

function symbolToString(symbol) {
  const match = SYMBOL_NAME_REGEX.exec(symbol.toString());
  return `@@${match[1]}`;
}

// Define exports

module.exports = function toString(value) {
  if (value == null) {
    return '';
  }

  const type = typeof value;
  if (type === 'string') {
    return value;
  } else if (type === 'symbol') {
    return symbolToString(value);
  }

  return `${value}`;
};
