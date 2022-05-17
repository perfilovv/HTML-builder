const path = require('path');
const fs = require('fs');
const infoOfFiles = file => {
  const arr = [];
  if (file.isFile()) {
    fs.stat(path.resolve(__dirname, 'secret-folder', file.name), (error, stats) => {
      if (error) {
        return console.log(error);
      }
      arr.push(file.name.split('.').slice(0, -1).join('.'));
      arr.push(path.extname(file.name).slice(1));
      arr.push((Math.abs(stats.size/1024)) + 'kb');
      console.log(arr.join(' - '));
    });
  }
};
fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, (error, files) => {
  if (error) {
    return console.log(error);
  }
  files.forEach(item => {
    infoOfFiles(item);
  });
});