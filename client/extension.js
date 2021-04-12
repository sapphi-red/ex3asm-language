const vscode = require('vscode')
const opts = require('./opts.json')

const optList = Object.keys(opts)

const EX3ASM = 'ex3asm'

vscode.languages.registerHoverProvider(EX3ASM, {
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

vscode.languages.registerCompletionItemProvider(EX3ASM, {
  provideCompletionItems(document, position, token) {
    const range = document.getWordRangeAtPosition(position, /[A-Z]+/)
    if (!range) {
      return new vscode.CompletionList(
        optList.map(opt => ({
          label: opt,
          kind: vscode.CompletionItemKind.Function
        }))
      )
    }

    const opt = document.getText(range)
    if (opt.length >= 3) {
      return null
    }

    const filteredOptList = optList.filter(o => o.startsWith(opt))
    if (filteredOptList.length <= 0) {
      return null
    }

    return new vscode.CompletionList(
      filteredOptList.map(opt => ({
        label: opt,
        kind: vscode.CompletionItemKind.Function
      }))
    )
  }
}, ' ', '\t')
