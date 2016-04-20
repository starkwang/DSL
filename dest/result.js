'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = check;

var _tokenizer = require('./tokenizer');

var _tokenizer2 = _interopRequireDefault(_tokenizer);

require('babel-polyfill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CMP_SYMBOL = ['>', '<', '<=', '>=', '==', '===', '!=', '!=='];

function check(object) {
    var origin = { object: object };
    return new Proxy(origin, {
        get: function get(target, property) {
            if (target.__logicValue == false) {
                return check(target);
            }
            if (property == '_') {
                return target.__logicValue;
            }
            var object = target.object;

            var DSL = (0, _tokenizer2.default)(property);
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
    if (value == undefined) {
        return false;
    }
    if (typeof value === 'number') {
        var result = DSLarr.map(function (word) {
            return CMP_SYMBOL.indexOf(word) != -1 ? value + word : word;
        }).join('');
    }
    if (typeof value === 'string') {
        var result = DSLarr.map(function (word) {
            return CMP_SYMBOL.indexOf(word) != -1 ? '"' + value + '"' + word : word;
        }).join('');
    }
    console.log(eval(result));
    return eval(result);
}

check("123")["length: > 3"]["length: > 0"]._; //false
check("123")["length: > 3 || <5"]["length: > 0"]._; //true
check({
    value1: 100,
    value2: 100
})["value1: > 99"]["value2:>10"]._;
