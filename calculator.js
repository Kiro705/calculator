function Calculator(input) {
  this.tokenStream = this.lexer(input);
  this.root = this.parseExpression();
}

function TreeNode(name, ...children) {
  this.name = name;
  this.children = children;
}

function VisitToPrint(){
  this.visit = function(node) {
    switch(node.name) {
      case "Expression":
        return node.children[0].accept(this) + node.children[1].accept(this);
        break;
      case "Term":
        return node.children[0].accept(this) + node.children[1].accept(this);
        break;
      case "A":
        if(node.children.length > 0) {
          return  node.children[0] + node.children[1].accept(this) + node.children[2].accept(this);
        } else {
          return "";
        }
        break;
      case "B":
        if(node.children.length > 0) {
          return  node.children[0] + node.children[1].accept(this) + node.children[2].accept(this);
        } else {
          return "";
        }
        break;
      case "F":
        if(node.children.length === 3) {
          return  node.children[0] + node.children[1].accept(this) + node.children[2];
        } else if(node.children.lenth === 2) {
          return node.children[0] + node.children[1].accept(this);
        } else {
          return node.children[0];
        }
        break;
      default:
        break;
    }
  }
}

TreeNode.prototype.accept = function(visitor){
  return visitor.visit(this);
}

Calculator.prototype.lexer = function(str) {
  const stream = []
  const tokenTypes = [
    ['NUMBER',    /^\d+/ ],
    ['ADD',       /^\+/  ],
    ['SUB',       /^\-/  ],
    ['MUL',       /^\*/  ],
    ['DIV',       /^\//  ],
    ['LPAREN',    /^\(/  ],
    ['RPAREN',    /^\)/  ]
  ]
  for (let i = 0; i < str.length; i++) {
    let foundIt = false
    tokenTypes.forEach(function(el) {
      if (str[i].match(el[1])) {
        foundIt = true
        stream.push({name: el[0], value: str[i]})
      }
    })
    if (!foundIt) {
      throw new Error('Found uparseable token: ' + str[i])
    }
  }
  return stream
}

Calculator.prototype.peek = function() {
  return this.tokenStream[0] || null;
}

Calculator.prototype.get = function() {
  return this.tokenStream.shift();
}

Calculator.prototype.parseExpression = function() {
  var t = this.parseTerm();
  var a = this.parseA();
  return new TreeNode('Expression', t, a);
}

Calculator.prototype.parseTerm = function() {
  const f = this.parseF()
  const b = this.parseB()
  return new TreeNode('Term', f, b)
}

Calculator.prototype.parseA = function() {
  const nextToken = this.peek();
  if (nextToken && nextToken.name === 'ADD') {
    this.get();
    return  new TreeNode('A', '+', this.parseTerm(), this.parseA())
  } else if (nextToken && nextToken.name === 'SUB') {
    this.get();
    return new TreeNode('A', '-', this.parseTerm(), this.parseA())
  } else {
    return new TreeNode('A')
  }
}

Calculator.prototype.parseB = function() {
  const nextToken = this.peek();
  if (nextToken && nextToken.name === 'MUL') {
    this.get();
    return  new TreeNode('B', '*', this.parseF(), this.parseB())
  } else if (nextToken && nextToken.name === 'DIV') {
    this.get();
    return new TreeNode('B', '/', this.parseF(), this.parseB())
  } else {
    return new TreeNode('B')
  }
}

Calculator.prototype.parseF = function() {
  const nextToken = this.peek();
  if (nextToken && nextToken.name === 'LPAREN') {
    this.get();
    const expr = this.parseExpression();
    this.get();
    return  new TreeNode('F', '(', expr, ')')
  } else if (nextToken && nextToken.name === 'SUB') {
    this.get();
    return new TreeNode('F', '-', this.parseF())
  } else if (nextToken) {
    this.get();
    return new TreeNode('F', nextToken.value);
  }
}

// Calculator.prototype.returnString = function(){
//   var stack = [this.root];
//   var result = '';
//   while (stack.length){
//     var current = stack.shift();
//     if(typeof current === 'string'){
//       result += current;
//     }
//     if(typeof current === 'object'){
//       for (var i = current.children.length - 1; i >= 0; i--){
//         stack.unshift(current.children[i]);
//       }
//     }
//     console.log(result);
//   }
//   return result;
// }



var calc = new Calculator('1+(2*3)');
var visitToPrint = new VisitToPrint();
console.log(calc.root.accept(visitToPrint));

