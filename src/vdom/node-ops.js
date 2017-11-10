function createElement (tagName) {
  return document.createElement(tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode)
}

function removeChild (node, child) {
  node.removeChild(child)
}

function appendChild (node, child) {
  node.appendChild(child)
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (elm) {
  return elm.tagName
}

function setTextContent (node, text) {
  node.textContent = text
}

function getTextContent (node) {
  return node.textContent
}

function isElement (node) {
  return node.nodeType === 1
}

function isText (node) {
  return node.nodeType === 3
}


const nodeOps = {
  createElement,
  createTextNode,
  insertBefore,
  removeChild,
  appendChild,
  parentNode,
  nextSibling,
  tagName,
  setTextContent,
  getTextContent,
  isElement,
  isText,
}

export default nodeOps