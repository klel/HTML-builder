const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

const sourceTmpl = __dirname + '/template.html';
const dest = __dirname + '/project-dist';

const htmlDest = dest + '/index.html';

(function recreateDestinationFolder() {
  const clearDirectory = (direct) => {
    fs.readdir(direct, { withFileTypes: true }, (err, files) => {
      if (err) throw err;
      else
        files.forEach((file) => {
          if (file.isFile()) {
            fs.unlink(path.join(direct, file.name), (err) => {
              if (err) throw err;
            });
          }
          if (file.isDirectory()) {
            clearDirectory(path.join(direct, file.name));
          }
        });
    });
  };

  fs.mkdir(dest, (err) => {
    if(!err){
      return;
    }

    if (err.code == 'EEXIST') {
      clearDirectory(dest);
    }
  });
})();

(async function createIndexHtml() {
  let components = await fsp.readdir(__dirname + '/components/', {
    withFileTypes: true,
  });

  let filenames = components.map((f) => {
    const extension = path.extname(__dirname + '/components/' + f.name);
    if (extension !== '.html') {
      return;
    }
    return f.name;
  });

  let data = await fsp.readFile(sourceTmpl, 'utf8');
  let resultPage = null;

  for (let file of filenames) {
    let tag = file.split('.')[0];

    let text = await fsp.readFile(__dirname + '/components/' + file, 'utf8');

    if (!resultPage) {
      resultPage = data.replace(new RegExp('{{' + tag + '}}', 'gm'), text);
    } else {
      resultPage = resultPage.replace(
        new RegExp('{{' + tag + '}}', 'gm'),
        text
      );
    }
  }
  fs.writeFile(htmlDest, resultPage, (err) => {
    if (err) {
      throw err;
    }
  });
})();

(async function buildStyles() {
  const sourceFolder = __dirname + '/styles/';
  const output = __dirname + '/project-dist/style.css';

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
})();

(function copyAssets() {
  async function copyDir(src, dest) {
    await fsp.mkdir(dest, { recursive: true });
    let entries = await fsp.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
      let srcPath = path.join(src, entry.name);
      let destPath = path.join(dest, entry.name);

      entry.isDirectory()
        ? await copyDir(srcPath, destPath)
        : await fsp.copyFile(srcPath, destPath);
    }
  }

  copyDir(__dirname + '/assets', dest + '/assets');
})();
