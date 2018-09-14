import {Render} from './utils'
import Compile from './compile'
export default function (filePath, options, callback) {
    fs.readFile(filePath, function (err, content) {
        if (err) {
            return callback(err)
        }
        var sqrlString = content.toString()
        var template = Compile(sqrlString)
        var renderedFile = Render(template, options)
        return callback(null, renderedFile)
    })
}