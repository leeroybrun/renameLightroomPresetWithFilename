const fs = require('fs');
const path = require('path');
const glob = require('glob');

var internalNameRegex = /internalName = "(.+)"/ig;
var titleRegex = /title = "(.+)"/ig;

let folderPath = null;
if(process.argv.length >= 3) {
  folderPath = process.argv[2];
}

if(folderPath === null) {
  console.log('Please provide a path where to process Lightroom Preset files.');
  process.exit();
}

glob(folderPath +'/**/*.lrtemplate', { absolute: true }, (err, files) => {
  if (err) {
    return console.log(err);
  }

  files.forEach((filePath) => {
    fs.readFile(filePath, 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }

      const fileName = path.basename(filePath, path.extname(filePath));

      data = data.replace(internalNameRegex, 'internalName = "'+ fileName +'"');
      data = data.replace(titleRegex, 'title = "'+ fileName +'"');

      fs.writeFile(filePath, data, (err) => {
        if (err) {
          return console.log(err);
        }

        console.log('File processed! '+ filePath);
      });
    });
  });
});

