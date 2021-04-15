const vscode = require('vscode')
const opts = require('./opts.json')

const optList = Object.entries(opts)

const EX3ASM = 'ex3asm'

const optDataToDoc = optData => {
  const doc = new vscode.MarkdownString()
  if (optData.code) {
    doc.appendMarkdown('**命令**')
    doc.appendCodeblock(optData.code)
  }
  if (optData.desc) {
    doc.appendMarkdown(optData.desc)
  }
  return doc
}

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

    const content = optDataToDoc(optData)

    return new vscode.Hover(
      content,
      range
    )
  }
})

const optToCompletion = (opt, optData) => {
  const completion = new vscode.CompletionItem(opt, vscode.CompletionItemKind.Function)
  completion.documentation = optDataToDoc(optData)
  return completion
}

vscode.languages.registerCompletionItemProvider(EX3ASM, {
  provideCompletionItems(document, position, token) {
    const range = document.getWordRangeAtPosition(position, /[A-Z]+/)
    if (!range) {
      return new vscode.CompletionList(
        optList.map(([opt, optData]) => optToCompletion(opt, optData))
      )
    }

    const opt = document.getText(range)
    if (opt.length >= 3) {
      return null
    }

    const filteredOptList = opts.filter(([o]) => o.startsWith(opt))
    if (filteredOptList.length <= 0) {
      return null
    }

    return new vscode.CompletionList(
      filteredOptList.map(([opt, optData]) => optToCompletion(opt, optData))
    )
  }
}, ' ', '\t')
