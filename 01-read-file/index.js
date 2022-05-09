const fs = require('fs');
const path = require('path');

fs.readFile(path.resolve('./01-read-file/text.txt'), 'utf8', (err, data) => {
  if (err) {
    throw err;
  }
  console.log(data);
});
