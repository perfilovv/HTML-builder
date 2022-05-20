const path = require('path');
const fs = require('fs');
const fsPr = require('fs/promises');
const styles = path.join(__dirname, 'styles');
const projectDist = path.join(__dirname, 'project-dist');
const assetsCopy = path.join(projectDist, 'assets');
const components = path.join(__dirname, 'components');
const assets = path.join(__dirname, 'assets');
const template = path.join(__dirname, 'template.html');

const buildHtml = async() => {
  const files = await fsPr.readdir(components, { withFileTypes: true }); 
  let templateHtml =  await fsPr.readFile(template, 'utf-8');
  for (let i = 0; i < files.length; i++) {
    const fileStr = path.join(components, files[i].name);
    const fileName = '{{' + path.parse(fileStr).name + '}}';  //Парсим имена файлов из папки components(article/footer/header)
    if (files[i].isFile() && path.extname(fileStr)==='.html') {
      const finalHtml = await fsPr.readFile(fileStr, 'utf-8');
      templateHtml = templateHtml.replace(fileName, finalHtml); //Заменяем шаблонные тэги на код из файлов(article/footer/header).html
    }
  }
  const output = fs.createWriteStream(path.join(projectDist, 'index.html')); //Добавляем index.html
  output.write(templateHtml);
};

const buildStyles = async() => {
  const output = fs.createWriteStream(path.join(projectDist, 'style.css')); //Добавляем style.css
  const files = await fsPr.readdir(styles, { withFileTypes: true });
  for (const file of files) {
    const fileStr = path.join(styles, file.name);
    if (file.isFile() && path.extname(fileStr)==='.css')
    {
      const input = fs.createReadStream(fileStr); // Считываем из потока чтения в поток записи, pipe()
      input.pipe(output);
    }
  } 
};

const recurceCopy = (dir, exit) => {
  fs.readdir(dir, {withFileTypes: true}, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      if (!file.isFile()) {
        fs.stat(path.join(exit, file.name), (err) => {  
          if (err) {
            fs.mkdir(path.join(exit, file.name), (err) => { //Создаем папки fonts/img/svg
              if (err) throw err;
            });
            recurceCopy(`${dir}\\${file.name}`, path.join(exit, file.name)); 
          } 
        });
      } else {
        fs.copyFile(`${dir}\\${file.name}`, `${exit}\\${file.name}`, (err) => { //Копируем файлы
          if (err) throw err;
        });
      }
    });
  });
};

fs.stat(projectDist, (err) => {
  if (err) {
    fs.mkdir(projectDist, (err) => {
      if (err) throw err;
    });
  } else {
    fs.readdir(projectDist, (err) => {
      if (err) throw err;
    });
  }
});

fs.stat(assetsCopy, (err) => {
  if (err) {
    fs.mkdir(assetsCopy, (err) => {
      if (err) throw err;
    });
    recurceCopy(assets, assetsCopy);
  } 
});

const fullBuild = async() => { 
  await buildHtml();
  await buildStyles();
};

fullBuild();
