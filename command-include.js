// const os =require('os')
const _rootConfig=require('./root')
const program = require('commander');
// const config=require('./wheeltoolConfig')
// const whelltoolFunc=require('./wheeltoolFunctions')
// const includeConfig = require('./command-include-config');
// const functions =require('./functions');
// const fs =require('fs')


// let _includeNodePath=path.join('./',includeConfig.strNodeName);
// let _fid=null;
// try {
//     _fid=fs.open( _includeNodePath ,'r+' );
// } catch (error) {
//     if(error.code==='ENOENT'){
//         _fid=fs.openSync(_includeNodePath,'a+');
//         fs.writeSync(_fid,JSON.stringify(includeConfig.createIncludeStruct())) 
//     }
// }
// fs.closeSync(_fid)
// fs.readFileSync(_includeNodePath);

program .command('check','in Node include source  check is usable',{executableFile:'command-include-check'})
        .command('source','add include source files',{executableFile: 'command-include-source'})
        .command('init','Init include files',{executableFile: 'command-include-init'})
        .command('show','Show Node file include agg',{executableFile:'command-include-show'})
        .command('pack [class-name...]','Pack Node in Source',{executableFile:'command-include-pack'})
program.parse(process.argv);






// console.log(program)
// console.log(process.cwd(),path.resolve('./'));


// fs.statSync(config.strGlobalCoreConPath).ino
