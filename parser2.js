import tokenizer from './tokenizer';
import "babel-polyfill";

var CMP_SYMBOL = ['>', '<', '<=', '>=', '==', '===', '!=', '!=='];

export default function check(object) {
    var origin = { object };
    return new Proxy(origin, {
        get: function(target, property) {
            if(target.__logicValue == false){
                return check(target);
            }
            if(property == '_'){
                return target.__logicValue;
            }
            var { object } = target;
            var DSL = tokenizer(property);
            if (DSL[0] === ':') {
                target.__logicValue = doCheck(object, DSL.splice(1));
                return check(target);
            } else if (DSL[1] === ':') {
                target.__logicValue = doCheck(object[DSL[0]], DSL.splice(2));
                return check(target);
            } else {
                console.error('Unexpected token:' + DSL[1]);
            }
        }
    });
}


function doCheck(value, DSLarr) {
    if (typeof value === 'string') {
        var result = DSLarr.map(word => CMP_SYMBOL.indexOf(word) != -1 ? `"${value}"` + word : word).join('');
    }else{
        var result = DSLarr.map(word => CMP_SYMBOL.indexOf(word) != -1 ? value + word : word).join('');
    }
    console.log(eval(result));
    return eval(result);
}

check("123")["length: > 3"]["length: > 0"]._;//false
check("123")["length: > 3 || <5"]["length: > 0"]._;//true
check({
    value1:100,
    value2:100
})["value1: > 99"]["value2:>10"]._;//true




