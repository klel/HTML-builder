const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

const sourceTmpl = __dirname + '/template.html';
const dest = __dirname + '/project-dist';

const htmlDest = dest + '/index.html';

const header = __dirname + '/components/header.html';
const footer = __dirname + '/components/footer.html';
const articles = __dirname + '/components/articles.html';

fs.mkdir(dest, { recursive: true }, (err) => {
  if (err) {
    throw err;
  }
});

(async function createIndexHtml() {
  let h = null,
    a = null,
    f = null;

  h = await fsp.readFile(header, 'utf8');
  a = await fsp.readFile(articles, 'utf8');
  f = await fsp.readFile(footer, 'utf8');

  fs.readFile(sourceTmpl, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }

    let result = data.replace(/{{header}}/, h);
    result = result.replace(/{{articles}}/, a);
    result = result.replace(/{{footer}}/, f);

    fs.writeFile(htmlDest, result, (err) => {
      if (err) {
        throw err;
      }
    });
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
