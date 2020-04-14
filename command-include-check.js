const fs=require('fs')
const path=require('path')
const includeConfig=require('./command-include-config')
const colors = require('colors/safe');
const program = require('commander');
const func =require('./functions');
const readlineSync = require('readline-sync');

program.option('-tryAutoFind, --tryAutoFind [path]','Try to automatically search for nonexistent files (not necessarily the right ones)');
program.option('-clear, --clearError [option]','Delete all error sources (add y instruction does not ask for deletion)');
program.parse(process.argv);
let _nodeFilePath=path.join('./',includeConfig.getNodeFilePath());
let _objContent=JSON.parse(fs.readFileSync(_nodeFilePath).toString());
let arrErrorSourceAgg=[];
for (const aggValue of _objContent.includeAgg) {
    try {
        fs.statSync(aggValue.path);
        console.log(colors.green(`File ${aggValue.name} Path ${aggValue.path} Check Success`));
    } catch (error) {
        arrErrorSourceAgg.push(aggValue);
        if(error.code==='ENOENT'){
            console.log( colors.red(`File Name:`),colors.blue(`${aggValue.name}`),colors.red(` Path`),colors.blue(` ${aggValue.path} `),colors.red(` is No-existent \nIt is recommended to use the -tryAutoFind option to try to recover`));
        }else{
            console.error(error);
        }
    }
}
console.log('');
let _trySuccess=new Set();
if(program.tryAutoFind&&arrErrorSourceAgg.length){
    if (program.tryAutoFind===true)program.tryAutoFind='./';
    let arrAllFileAgg=[];
    let _t=new Date().getTime();
    func.ergoDir(arrAllFileAgg,program.tryAutoFind)
    console.log(`Get to `,colors.blue(`${program.tryAutoFind}`),` owned file Total`, colors.yellow(` ${arrAllFileAgg.length}`) ,` Use Time`, colors.green(` ${(new Date().getTime()-_t)/1000}`) ,`s`) 
    for (const errorValue of arrErrorSourceAgg) {
        let boolSuccess=false;
        for (const allFileValue of arrAllFileAgg) {
            if(errorValue.ino===allFileValue.ino){
                console.log(colors.green(`File ${errorValue.name}( ${errorValue.path} ) Use `),colors.green(`${allFileValue.path}`),colors.green(` repair or not `));
                if(readlineSync.keyInYN('Use '+colors.blue(`${allFileValue.path}`)+' repair')){
                    console.log(colors.green(`Source ${errorValue.name} changed `),colors.gray(` ${errorValue.path} >>> ${allFileValue.path} `) );
                    errorValue.path=allFileValue.path;
                    _trySuccess.add(errorValue);
                    boolSuccess=true;
                    break;
                }
            }
        }
        if(!boolSuccess)console.log(colors.yellow(`No available files found repair ${errorValue.name}(${errorValue.path}).`))
    }
}

if(program.clearError){
    console.log('');
    let deleteAgg=new Set(arrErrorSourceAgg.filter((value)=>{
        return !_trySuccess.has(value)
    }))
    _objContent.includeAgg=_objContent.includeAgg.filter((value)=>{
        if(deleteAgg.has(value)){
            //del
            if(
                program.clearError==='Y'||
                program.clearError==='y'||
                readlineSync.keyInYN('Clear '+colors.red(`Name: ${value.name} Path:${value.path} `) )
            ){
                console.log(
                    colors.green(`Clear Error Name:${value.name} Path:${value.path}`)
                )
                return false;
            }else{
                return true;
            }
        }else{
            return true;
        }
    })
}


if(
    (program.tryAutoFind&&arrErrorSourceAgg.length)||
    program.clearError
){
    console.log('');
    let _content;
    try{
        _content=JSON.stringify(_objContent)
        fs.truncateSync(_nodeFilePath)
        fs.writeFileSync(_nodeFilePath,_content);
    }catch(error){
        console.error(error);
    }
    console.log(colors.green('Success Save File'))
}
    
