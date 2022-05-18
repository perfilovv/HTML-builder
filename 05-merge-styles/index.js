const path = require('path');
const fs = require('fs');
const css = path.join(__dirname, 'styles');
const bundle = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(css, (error, files) => {
  if (error) {
    throw error;
  }
  fs.writeFile(bundle, '', (error) => {
    if (error) {
      throw error;
    }
  });
  files.forEach((file) => {
    if (path.parse(path.join(css, file)).ext === '.css') {
      const output = fs.createReadStream(path.join(css, file));
      output.on('data', (data) => {
        fs.appendFile(bundle, data, (error) => {
          if (error) {
            throw error;
          }
        });
      });  
    }
  });
});