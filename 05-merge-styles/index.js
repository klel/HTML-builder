const fs = require('fs');
const path = require('path');

const sourceFolder = __dirname + '/styles/';
const output = __dirname + '/project-dist/bundle.css';

fs.writeFile(output, '', (err) => {
  if (err) {
    throw err;
  }
});

fs.readdir(sourceFolder, { withFileTypes: true }, (err, files) => {
  files.forEach((f) => {
    if (!f.isFile()) {
      return;
    }

    const extension = path.extname(sourceFolder + f.name);
    if (extension !== '.css') {
      return;
    }

    fs.readFile(sourceFolder + f.name, 'utf8', (err, data) => {
      if (err) {
        throw err;
      }

      fs.appendFile(output, data, (err) => {
        if (err) {
          throw err;
        }
      });
    });
  });
});
