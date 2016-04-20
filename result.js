"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = check;

var _tokenizer = require("./tokenizer");

var _tokenizer2 = _interopRequireDefault(_tokenizer);

require("babel-polyfill");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function check(value) {
    var origin = { value: value };
    return new Proxy(origin, {
        get: function get(target, property) {
            console.log(property);
            var value = target.value;

            console.log(value);
        }
    });
}

check(123)[">123"];

var CMP_SYMBOL = ['>', '<', '<=', '>=', '==', '===', '!=', '!=='];

function doCheck(value, DSL) {
    var result = (0, _tokenizer2.default)(DSL).map(function (word) {
        return CMP_SYMBOL.indexOf(word) != -1 ? value + word : word;
    }).join('');
    console.log(eval(result));
    return eval(result);
}

doCheck(123, ">2&&>3&&!!!!(>=4&&>=100)&&===123");
