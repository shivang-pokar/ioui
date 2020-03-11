/* 
* Set Bin Path
*/
const shellEnv = require('shell-env');
process.env['PATH'] = shellEnv.sync().PATH;


String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
