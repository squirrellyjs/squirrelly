import * as Sqrl from './index'
export default function (filePath, options, callback) {
    fs.readFile(filePath, function (err, content) {
        if (err) {
            return callback(err)
        }
        var sqrlString = content.toString()
        var template = Sqrl.Compile(sqrlString)
        var renderedFile = Sqrl.Render(template, options)
        return callback(null, renderedFile)
    })
}