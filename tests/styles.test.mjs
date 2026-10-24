import test from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import ts from 'typescript'
import postcss from 'postcss'

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? files(join(directory, entry.name))
      : [join(directory, entry.name)]
  )
}
const source = files('src')
const modules = new Map()
for (const file of source.filter((file) => file.endsWith('.module.css'))) {
  const classes = new Set()
  postcss.parse(readFileSync(file, 'utf8')).walkRules((rule) => {
    for (const match of rule.selector.matchAll(/\.([a-zA-Z_][\w-]*)/g))
      classes.add(match[1])
  })
  modules.set(resolve(file), classes)
}
const localClasses = new Set(
  [...modules.values()].flatMap((classes) => [...classes])
)
const globalCss = readFileSync('src/app/globals.css', 'utf8')

test('CSS module references resolve and local classes are never used as global strings', () => {
  const errors = []
  for (const file of source.filter((file) => file.endsWith('.tsx'))) {
    const ast = ts.createSourceFile(
      file,
      readFileSync(file, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX
    )
    const imports = new Map()
    for (const node of ast.statements) {
      if (
        ts.isImportDeclaration(node) &&
        node.moduleSpecifier.text.endsWith('.module.css')
      ) {
        imports.set(
          node.importClause.name.text,
          modules.get(resolve(dirname(file), node.moduleSpecifier.text))
        )
      }
    }
    function visit(node) {
      if (
        ts.isPropertyAccessExpression(node) ||
        ts.isElementAccessExpression(node)
      ) {
        const classes = imports.get(node.expression.getText(ast))
        const key = ts.isPropertyAccessExpression(node)
          ? node.name.text
          : node.argumentExpression?.text
        if (classes && key && !classes.has(key))
          errors.push(`${file}: missing CSS module class ${key}`)
      }
      if (
        ts.isJsxAttribute(node) &&
        node.name.text === 'className' &&
        node.initializer &&
        ts.isStringLiteral(node.initializer)
      ) {
        for (const key of node.initializer.text.split(/\s+/)) {
          if (localClasses.has(key) && !globalCss.includes(`.${key}`))
            errors.push(`${file}: scoped class ${key} used as a global string`)
        }
      }
      ts.forEachChild(node, visit)
    }
    visit(ast)
  }
  assert.deepEqual(errors, [])
})

test('Every stylesheet uses defined typography tokens', () => {
  const definitions = new Set(
    [...globalCss.matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1])
  )
  for (const file of source.filter((file) => file.endsWith('.css'))) {
    for (const match of readFileSync(file, 'utf8').matchAll(
      /var\((--(?:text|leading)-[\w-]+)\)/g
    )) {
      assert.ok(
        definitions.has(match[1]),
        `${file}: undefined token ${match[1]}`
      )
    }
  }
})
