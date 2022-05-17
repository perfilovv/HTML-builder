const path = require('path');
const fs = require('fs');
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const {stdin, stdout, exit} = process;
stdout.write('Введите текст:');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    exit();
  }
  output.write(data);
});
process.on('exit', () => {
  stdout.write('До свидания!');
});
  
