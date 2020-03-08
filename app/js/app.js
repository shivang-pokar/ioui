/* 
* Set Bin Path
*/
const shellEnv = require('shell-env');
process.env['PATH'] = shellEnv.sync().PATH;