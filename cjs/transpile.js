const fs = require('fs')
    , path = require('path')

fs.readdirSync(path.join('lib')).forEach(name =>
  fs.writeFileSync(
    path.join('cjs', name),
    fs.readFileSync(path.join('lib', name), 'utf8')
      .replace(/export default function ([^(]+)/, 'module.exports = $1;function $1')
      .replace(/export default /, 'module.exports = ')
      .replace(/export const ([a-z0-9_$]+)/gi, 'const $1 = module.exports.$1')
      .replace(/export function ([a-z0-9_$]+)/gi, 'module.exports.$1 = function $1')
      .replace(/import {([^{}]*?)} from (['"].*?['"])/gi, 'const {$1} = require($2)')
      .replace(/import (.*?) from (['"].*?['"])/gi, 'const $1 = require($2)')
  )
)

const json = JSON.parse(fs.readFileSync('package.json', 'utf8'))
json.type = 'commonjs'
json.files = undefined

fs.writeFileSync(
  path.join('cjs', 'package.json'),
  JSON.stringify(json, null, 2)
)
