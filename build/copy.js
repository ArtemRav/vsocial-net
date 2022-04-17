var fs = require('fs')
var path = require('path')

function copyFileSync(source, target) {
  var targetFile = target

  // If target is a directory, a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source))
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source))
}

copyFileSync('./libs/social_net_library.js', '../../WebSoftAdmin/wtv/libs')
copyFileSync('./libs/social_net_library.json', '../../WebSoftAdmin/wtv/libs')
