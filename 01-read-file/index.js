const fs = require('fs');
const path = require('path');

var stream = fs.createReadStream(path.resolve('./01-read-file/text.txt'), {encoding: 'utf-8'});

stream.on('readable', function () {
  var data = stream.read();
  if (data){
    console.log(data);
  }
});
