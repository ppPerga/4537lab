const mo = require('./modules/math')
const { getString } = require('./modules/utils');

const addMessage = getString('addMessage');
const subtractMessage = getString('subtractMessage');
console.log(addMessage, mo.add(2, 2), subtractMessage, mo.subtract(5, 3));
