const fs = require('fs');
const path = require('path');

const source = __dirname + '/secret-folder/';

fs.readdir(source, { withFileTypes: true }, (err, files) => {
  if (err) {
    throw err;
  }

  files.forEach((f) => {
    if (f.isFile()) {
      const extension = path.extname(source + f.name).slice(1);
      const name = path.basename(
        source + f.name,
        path.extname(source + f.name)
      );

      fs.stat(source + f.name, (err, file) => {
        if (err) {
          throw err;
        }

        let size = new Intl.NumberFormat('de-De').format(file.size);

        console.log(`${name} - ${extension} - ${size}b`);
      });
    }
  });
});
