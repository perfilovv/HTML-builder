const path = require('path');
const fs = require('fs');
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const {stdin, stdout, exit} = process;
stdout.write('Введите текст:');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    quit();
  }
  output.write(data);
});

const quit = () => {
  stdout.write('До свидания!');
  exit();
};
process.on('SIGINT', quit); 
