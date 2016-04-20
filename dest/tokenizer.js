'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = tokenizer;
function tokenizer(content) {
    //结果数组
    var result = [];

    //特殊符号的集合
    var symbol = [':', '(', ')'];

    //是否在字符串中，如果是的话，要保留换行、缩进、空格
    var isInString = false;

    //当前的单词栈
    var tmpStack = '';

    function clearStack() {
        if (tmpStack.length != 0) {
            result.push(tmpStack);
            tmpStack = '';
        }
    }

    for (var i = 0; i < content.length; i++) {
        var t = content[i];
        if (t == '\'' || t == '\"') {
            if (isInString) {
                tmpStack += t;
                isInString = false;
                result.push(tmpStack);
                tmpStack = '';
            } else {
                tmpStack += t;
                isInString = true;
            }
            continue;
        }

        if (isInString) {
            tmpStack += t;
        } else {
            if (t == '\n' || t == ' ' || t == '    ') {
                clearStack();
                continue;
            }
            if (symbol.indexOf(t) != -1) {
                clearStack();
                result.push(t);
                continue;
            }
            if (t == '&' || t == '|') {
                clearStack();
                if (content[i + 1] == t) {
                    result.push(t + t);
                    i++;
                    continue;
                } else {
                    console.error("unexpected token:" + content[i + 1] + '   expect token:' + t);
                }
            }
            if (t == '=') {
                clearStack();
                if (content[i + 1] == '=') {
                    if (content[i + 2] == '=') {
                        result.push('===');
                        i = i + 2;
                        continue;
                    } else {
                        result.push('==');
                        i++;
                        continue;
                    }
                } else {
                    console.error("unexpected token:" + content[i + 1] + '   expect token: =');
                }
            }
            if (t == '!') {
                clearStack();
                if (content[i + 1] == '=') {
                    if (content[i + 2] == '=') {
                        result.push('!==');
                        i = i + 2;
                        continue;
                    } else {
                        result.push('!=');
                        i = i + 1;
                        continue;
                    }
                } else {
                    result.push('!');
                    continue;
                }
            }
            if (t == '>' || t == '<') {
                clearStack();
                if (content[i + 1] == '=') {
                    result.push(t + '=');
                    i++;
                    continue;
                } else {
                    result.push(t);
                    continue;
                }
            }
            tmpStack += t;
            if (i == content.length - 1) {
                clearStack();
            }
        }
    }
    //console.log(result);
    return result;
}
//tokenizer('length:(>6&&<12)||!!(>15&&(>=16&&<=39)&&!=12&&!==13)')

// tokenizer('value: =="abc"||===\'def\'')
