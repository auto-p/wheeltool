const program = require('commander');
const fs = require('fs')
const colors = require('colors/safe');
const functions =require('./functions');
const path =require('path');
const _rootConfig=require('./root')
const includeConfig = require('./command-include-config');
const config =require('./wheeltoolConfig')

program.option('-clear,--clear','clear wheeltool');
program.parse(process.argv);

let _root='./'

let _includeNodePath=includeConfig.getNodeFilePath(_root);
let _includeNodeDirPath=path.join(_root,includeConfig.strNodeFileDir);
try{
    if(fs.statSync(_includeNodeDirPath).isDirectory()) {
    }else{
        console.error('Is ',_includeNodeDirPath,' existence is File Not Dir');
        process.exit(1);
    }
}catch(error){
    if(error.code==='ENOENT'){
        fs.mkdirSync(_includeNodeDirPath);
    }else{
        throw(error);
    }
}


if( functions.createDefaultFile(
        _includeNodePath,
        JSON.stringify(includeConfig.createNodeStruct())
    )&&
    !program.clear
){
    //if file existence
    let _nodeContent=JSON.parse(fs.readFileSync(_includeNodePath).toString())
    if(_nodeContent.version!=config.strVersion){
        _nodeContent=Object.assign({},includeConfig.createNodeStruct(),_nodeContent);
        _nodeContent.version=config.strVersion;
        let _strNewContent=JSON.stringify(_nodeContent);
        fs.truncateSync(_includeNodePath);
        fs.writeFileSync( _includeNodePath,_strNewContent);
        console.log( colors.green('Success update Node file !'))
    }else{
        console.log( colors.green('Node file is new !'));
    }
}

if(program.clear){
    fs.truncateSync(_includeNodePath)
    fs.writeFileSync(_includeNodePath,JSON.stringify(includeConfig.createNodeStruct()) )
    console.log( colors.green(`Clear ${_includeNodePath} Success !`))
}
console.log( colors.grey(`Init ${_includeNodePath}`))
