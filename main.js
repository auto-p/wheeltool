// const os =require('os')
// const path = require('path')
// const colors = require('colors/safe');
// const path = require('path')
// let _t=new Date().getTime();
// console.log((new Date().getTime()-_t)/1000)
const _rootConfig=require('./root')
const program = require('commander');
const globalConfig=require('./wheeltoolConfig')
const whelltoolFunc=require('./wheeltoolFunctions')

console.log('');
whelltoolFunc.initGlobal();
program
  .name(globalConfig.strName)
  .version(globalConfig.strVersion)
  .command('include','add include path',{executableFile: 'command-include'})
  .command('get','get global source',{executableFile: 'command-get'})
  .parse(program.argv)
