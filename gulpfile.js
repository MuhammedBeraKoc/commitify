const { src, dest, series } = require('gulp')
const run = command => require('gulp-run')(command, {})
const eslint = require('gulp-eslint')

function lint() {
    return src(['bin/**/*.js']).pipe(eslint()).pipe(eslint.format()).pipe(eslint.failAfterError())
}

function prettify() {
    return run('prettier --config .prettierrc bin/**/*.js --write').exec()
}

function printPackageInfo() {
    return run('npm pack --dry-run').exec()
}

exports.default = series(lint, prettify, printPackageInfo)
