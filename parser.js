// class AST {
//     constructor(logic, check) {
//         this.logic = logic;
//         this.check = check;
//     }
// }
var tokenizer = require('./tokenizer');
function AST(logic, check) {
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

function getAST(code) {
    var logicSymbol = ['!', '>', '<', '<=', '>=', '==', '===', '!=', '!=='];
    var blockSymbol = ['(', ')'];
    var NEST = 0;
    var inBlock = false;
    var tmpCodeStack = [];

    for (var i = code.length - 1; i >= 0; i--) {
        var t = code[i];
        if (t == ')') {
            NEST++;
            inBlock = true;
            continue;
        }
        if (t == '(') {
            NEST--;
            if (NEST == 0) {
                inBlock = false;
                getAST(tmpCodeStack);
            }
            continue;
        }

        if (inBlock) {
            tmpCodeStack.push(t);
        } else {
            console.log(t);
        }

    }
}

// getAST(tokenizer('length:>32'));

getAST(tokenizer('length:(>6&&<12)||!!(>15&&(>=16&&<=39)&&!=12&&!==13)'))



