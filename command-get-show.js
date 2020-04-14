const path =require('path');
const md5 =require('md5-node')
const globalConfig =require('./wheeltoolConfig.js');
const globalFunc =require('./wheeltoolFunctions')
const _rootConfig=require('./root')
const includeConfig=require('./command-include-config')
const func=require('./functions')
const moment=require('moment')
const readlineSync=require('readline-sync')
const colors=require('colors/safe')
const strNodeCachePackDir='cachePack';
const program = require('commander');
const fs=require('fs')
program.option('-class, --sourceClass <SourceClassName>','select class con default all',null)
program.option('-name, --sourceName <SourceName>','select name con default all',null)
program.parse(program.argv);

let objCoreContent=JSON.parse(globalFunc.readCoreContent());
let libraryObjectAgg=Object.values(objCoreContent.libraryAgg)
let libraryAgg=[];
for (const libraryObjectValue of libraryObjectAgg){
    libraryAgg.push(...Object.values(libraryObjectValue.sourceAgg));
}
libraryAgg=libraryAgg.filter((value)=>{
    if(value.class===program.sourceClass||program.sourceClass===null){
    }else{
        return false;
    }
    if(value.name===program.sourceName||program.sourceName===null){
    }else{
        return false;
    }
    return true;
})
console.dir(libraryAgg,{depth:4,colors:true});
