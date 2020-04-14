const colors = require('colors/safe');
console.error=function() {
    console.log(colors.red(...arguments))
}
