// class AST {
//     constructor(logic, check) {
//         this.logic = logic;
//         this.check = check;
//     }
// }

var cmpSymbol = ['>', '<', '<=', '>=', '==', '===', '!=', '!=='];
var logicSymbol = ['&&', '||', '!'];
var blockSymbol = ['(', ')'];


var tokenizer = require('./tokenizer');

function ASTNode(logic, check) {
    this.logic = logic;
    this.check = check;
}

function parser(code) {
    var acceptedCheckType = ['length', 'value'];
    if (acceptedCheckType.indexOf(code[0]) === -1) {
        console.error('unexpected check type:' + code[0]);
        return;
    }
    if (code[1] != ':') {
        console.error('multiple check type is not accepted');
        return;
    }
    var mainCode = code.splice(2);

}


var AST = {
    __rootNode: {},
    __nodeStack: [],
    __nowNodeStatus: 0,
    newNode: function() {
        if (this.__nodeStack.length == 0) {
            var newNode = {
                logic: '',
                check: []
            }
            this.__nodeStack.push(newNode);
            this.__rootNode = newNode;

        } else {
            var nowNode = this.__nodeStack[this.__nodeStack.length - 1];
            var newNode = {
                logic: '',
                check: []
            }
            if (this.__nowNodeStatus == 2) {
                //左节点缺失
                nowNode.check[0] = newNode;
                this.__nodeStack.push(newNode);

            } else {
                nowNode.check[1] = newNode;
                this.__nodeStack.push(newNode);
            }
            this.__nowNodeStatus = 0;
        }
    },

    addLogic: function(t) {
        console.log("add logic:" + t);
        if (this.__nowNodeStatus == 1) {
            this.__nodeStack[this.__nodeStack.length - 1].logic = t;
            this.__nowNodeStatus = 2;
            return;
        }
        if (this.__nowNodeStatus == 4) {
            var newNode = {
                logic: t,
                check: [undefined, this.__nodeStack[this.__nodeStack.length - 1]]
            }
            this.__nodeStack.pop();
            this.__nodeStack[this.__nodeStack.length - 1].check[1] = newNode;
            this.__nowNodeStatus = 2;
            return;
        }
    },

    addCmp: function(t) {
        console.log("add cmp:" + t);
        if (this.__nowNodeStatus == 0) {
            this.__nodeStack[this.__nodeStack.length-1].check[1] = t;
            this.__nowNodeStatus = 1;
            return;
        }
        if (this.__nowNodeStatus == 2) {
            this.__nodeStack[this.__nodeStack.length - 1].check[0] = t;
            this.__nowNodeStatus = 4;
            return;
        }
    }

}


function LL(code) {
    console.log("\n\nLL start")
    AST.newNode();
    console.log(code);

    var NEST = 0;
    var inBlock = false;
    var tmpCodeStack = [];

    for (var i = code.length - 1; i >= 0; i--) {
        var t = code[i];
        if (inBlock) {
            if (t == ')') {
                tmpCodeStack.push(t);
                NEST++;
                continue;
            }
            if (t == '(') {
                NEST--;
                if (NEST == 0) {
                    inBlock = false;
                    //console.log(tmpCodeStack);
                    LL(tmpCodeStack.reverse());
                    tmpCodeStack = [];
                } else {
                    tmpCodeStack.push(t);
                }
                continue;
            }
            tmpCodeStack.push(t);
        } else {
            if (t == ')') {
                NEST++;
                inBlock = true;
                continue;
            }
            if (cmpSymbol.indexOf(t) == -1 && logicSymbol.indexOf(t) == -1 && cmpSymbol.indexOf(code[i - 1]) != -1) {
                AST.addCmp(code[i - 1] + t);
            } else if (logicSymbol.indexOf(t) != -1) {
                AST.addLogic(t);
            }
        }

    }
    console.log("LL end\n\n")
}

// getAST(tokenizer('length:>32'));

var a = LL(tokenizer('(>6&&<12)||!!(>15&&(>=16&&<=39&&<=45)&&!=12&&!==13)'));
console.log(AST.__nodeStack);
