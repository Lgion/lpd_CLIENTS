const fs = require('fs');
const path = require('path');

function generateJSON(directoryPath) {
  const result = [];

  function traverseDirectory(currentPath, currentArr) {
    const files = fs.readdirSync(currentPath).sort();

    const directories = [];

    files.forEach(file => {
      const filePath = path.join(currentPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        directories.push(file);
      } else if (stats.isFile()) {
        currentArr.push({ src: file });
      }
    });

    directories.forEach(directory => {
      const nestedArr = [];
      const nestedObj = {};
      nestedObj[directory] = nestedArr;
      currentArr.push(nestedObj);
      traverseDirectory(path.join(currentPath, directory), nestedArr);
    });
  }

  traverseDirectory(directoryPath, result);

  return { racine: result };
}

const directoryPath = '../../../public/img/_/';
const json = generateJSON(directoryPath);

// Écriture du fichier JSON
const outputFilePath = 'output.json';
fs.writeFileSync(outputFilePath, JSON.stringify(json, null, 2));

console.log('Le fichier JSON a été généré avec succès.');
console.log(json)

