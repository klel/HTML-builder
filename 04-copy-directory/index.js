const fs = require('fs');

const source = __dirname + '/files';
const dest = __dirname + '/files-copy';

fs.mkdir(dest, { recursive: true }, (err) => {
  if (err) {
    throw err;
  }
});

fs.readdir(source, (err, files) => {
  if (err) {
    throw err;
  }

  files.forEach((f) => {
    fs.copyFile(source + '/' + f, dest + '/' + f, (err) => {
      if (err) {
        throw err;
      }
    });
  });
});
