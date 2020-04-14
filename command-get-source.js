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
program.parse(program.argv);
// console.log(program.args);
let arrClassNameAgg=func.analyClassName(program.args,includeConfig.objSourceKeyDefaultValue.class);
// console.log(arrClassNameAgg);
let objCoreContent=JSON.parse(globalFunc.readCoreContent());
let libraryObjectAgg=Object.values(objCoreContent.libraryAgg)
let libraryAgg=[];
for (const libraryObjectValue of libraryObjectAgg){
    libraryAgg.push(...Object.values(libraryObjectValue.sourceAgg));
}

let arrCacheSourceAgg=[]

for (const classNameValue of arrClassNameAgg) {
    let _arrCacheAgg=[];
    for (const libraryValue of libraryAgg) {
        if(
            classNameValue.class===libraryValue.class&&
            classNameValue.name===libraryValue.name
        ){
            _arrCacheAgg.push(libraryValue);
        }
    }
    if(_arrCacheAgg.length){
        arrCacheSourceAgg.push( _arrCacheAgg.length===1?_arrCacheAgg[0]:_arrCacheAgg );
    }else{
        console.error(` ${classNameValue.class}-${classNameValue.name} in global It doesn't exist`)
    }
}

for (const arrCacheSourceKey in arrCacheSourceAgg) {
    if(Array.isArray(arrCacheSourceAgg[arrCacheSourceKey])){
        let _select={};
        let id=1;
        console.log(colors.yellow(`${arrCacheSourceAgg[arrCacheSourceKey][0].class}-${arrCacheSourceAgg[arrCacheSourceKey][0].name} there are multiple`));
        for (const arrCacheSourceAggValue of arrCacheSourceAgg[arrCacheSourceKey]) {
            console.log(colors.green(`ID: ${id} `),JSON.stringify(arrCacheSourceAggValue));
            _select[id++]=arrCacheSourceAggValue;
        }
        let _selectId=null;
        let _while=true;
        while(_while){
            _selectId=readlineSync.question('Select source id or in -e/-E (Exit selection this source) :');
            switch (_selectId) {
                case '-e':
                case '-E':
                    _while=false;
                    break;
                default:
                    if(_select.hasOwnProperty(Number(_selectId))){
                        _while=false;
                    }else{
                        console.error(
                            `Unid: ${_selectId} If Exit this Source select input -e or -E `
                        )
                    }
                    break;
            }
        }
        if(_select.hasOwnProperty(Number(_selectId))){
            arrCacheSourceAgg[arrCacheSourceKey]=_select[_selectId];
        }
    }
    if( Object.prototype.toString.call(arrCacheSourceAgg[arrCacheSourceKey]) === Object.prototype.toString.call({}) ){
        let strFileName= path.basename(arrCacheSourceAgg[arrCacheSourceKey].path);
        let arrFileInfo=strFileName.split('@');
        console.log(123,arrFileInfo,arrCacheSourceAgg[arrCacheSourceKey]);
        let strOutFileName=globalConfig.createGetOutputFileName(
            moment(Date.now()).format('YYYY-MM-DD-HH-mm-ss'),
            arrFileInfo[0],
            arrCacheSourceAgg[arrCacheSourceKey].class,
            arrCacheSourceAgg[arrCacheSourceKey].name,
            arrFileInfo[2]
        );
        console.log(strOutFileName);
        fs.writeFileSync(path.join('./',strOutFileName),fs.readFileSync(arrCacheSourceAgg[arrCacheSourceKey].path));
    }
}