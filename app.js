const mo = require('./modules/math')
const ADD_MESSAGE = "Hello Coda. 2 + 2 = \n"
const SUB_MESSAGE = " Another function is 5 - 3 = "
console.log(ADD_MESSAGE, mo.add(2, 2), SUB_MESSAGE, mo.subtract(5, 3));
