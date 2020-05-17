const {TokenParser, MarkDownNodeParser, HTMLParser} = require('md-to-html-lite')

const md2Html = (markdownString) => {
  let parser = new TokenParser(markdownString)
  parser.parseToToken()
  let tokens = parser.getTokens()
  let nodeParser = new MarkDownNodeParser(tokens)
  let node = nodeParser.parseToNode()
  let html = HTMLParser(node)
  return html
}

module.exports = {md2Html}