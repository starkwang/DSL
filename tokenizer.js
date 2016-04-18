function tokenizer(content) {
    //结果数组
    var result = [];

    //特殊符号的集合
    var symbol = [':', '(', ')', '>', '<', '!'];

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
                clearStack()
                continue;
            }
            if (symbol.indexOf(t) != -1) {
                clearStack()
                result.push(t);
                continue;
            }
            if (t == '&' || t == '|') {
                clearStack()
                if (content[i + 1] == t) {
                    result.push(t + t);
                    i++;
                    continue;
                } else {
                    console.error("unexpected token:" + content[i + 1] + '   expect token:' + t);
                }
            }
            tmpStack += t;
        }
    }
    console.log(result);
    return result;
}

tokenizer('length:>6&&(<12||>39)')

tokenizer('value:"abc"||\'def\'')
