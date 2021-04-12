const vscode = require('vscode')
const opts = require('./opts.json')

vscode.languages.registerHoverProvider('ex3asm', {
  provideHover(document, position, token) {
    const range = document.getWordRangeAtPosition(position, /[A-Z]{3}/)
    if (!range) {
      return null
    }

    const opt = document.getText(range)
    const optData = opts[opt]
    if (!optData) {
      return null
    }

    const content = new vscode.MarkdownString()
    if (optData.code) {
      content.appendMarkdown('**命令**')
      content.appendCodeblock(optData.code)
    }
    if (optData.desc) {
      content.appendMarkdown(optData.desc)
    }

    return new vscode.Hover(
      content,
      range
    )
  }
})
