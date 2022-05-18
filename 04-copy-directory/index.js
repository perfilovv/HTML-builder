const path = require('path');
const fs = require('fs/promises');
const dir = path.join(__dirname, 'files');
const dirCopy = path.join(__dirname, 'files-copy');

fs.rm(dirCopy, {
  recursive:true,
  force: true
}).finally(() => {
  fs.mkdir(dirCopy, {
    recursive: true
  });
  fs.readdir(dir, {
    withFileTypes:true
  }).then((data) => {
    data.forEach((item) => {
      if (item.isFile()) {
        const pathItem = path.join(dir, item.name);
        const pathItemCopy = path.join(dirCopy, item.name);
        fs.copyFile(pathItem, pathItemCopy);
      }
    });
  });
});