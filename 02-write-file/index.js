const fs = require('fs');
const path = require('path');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const filename = path.resolve('./02-write-file/text.txt');

fs.writeFile(filename, '', (err) => {
  if (err) {
    throw err;
  }
});

readline.question('Enter something \n', (data) => {
  if (data === 'exit') {
    exit();
  }
  fs.appendFile(filename, data, (err) => {
    if (err) {
      throw err;
    }
  });
});

readline.on('line', (input) => {
  if (input === 'exit') {
    exit();
  }
  fs.appendFile(filename, '\n' + input, (err) => {
    if (err) {
      throw err;
    }
  });
});

const exit = () => {
  process.exit();
};

process.on('exit', () => {
  console.log('Good luck!');
});
