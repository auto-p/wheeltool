const program = require('commander');
const fs = require('fs');
const path = require('path');
const includeConfig= require('./command-include-config');
const colors = require('colors/safe');
const commandErrorSign=require('./command-include-error')
const readline = require('readline');
const _rootConfig=require('./root')
const readlineSync = require('readline-sync');
//  program.parse(program.argv);
program.requiredOption('-name, --sourceName <name>','include file name'); //name
program.option('-path, --sourcePath <path>','include file path'); //path
program.option('-class, --class <className>','include file class',includeConfig.objSourceKeyDefaultValue.class);
program.option('-brief, --brief <brief>','brief file info content');
program.option('-update, --update [name]','update Source record',false);
program.option('-delete, --delete [name]','delete Source',false);
// program.command('source <path>','add include source files',{executableFile: 'command-source'})
program.parse(program.argv);

try {
    let _oSource=includeConfig.createIncludeSourceStruct({
        name:program.sourceName,
        path:program.sourcePath,
        ino:undefined,
        brief: program.brief,
        class: program.class
    });
    console.log( colors.gray('In Source '),_oSource,'\n');
    let _nodePath=path.join('./',includeConfig.getNodeFilePath());
    let _nodeFileContent=fs.readFileSync(_nodePath).toString('utf8');
    let _nodeFileObject=JSON.parse(_nodeFileContent);
    if(program.delete){
        for (const includeAggIndex in _nodeFileObject.includeAgg) {
            if(
                _nodeFileObject.includeAgg[includeAggIndex].name===_oSource.name&&
                _nodeFileObject.includeAgg[includeAggIndex].class===_oSource.class
            ){
                console.log(colors.red('Delete source:'),colors.gray(_nodeFileObject.includeAgg[includeAggIndex]));
                if(readlineSync.keyInYN('Delete ?')){
                    _nodeFileObject.includeAgg.splice(includeAggIndex,1);
                }
                break;
            }
        }
    }else{
        let _add=true;
        switch (typeof program.update) {
            case 'boolean':
                for (const includeAggIndex in _nodeFileObject.includeAgg) {
                    if( _nodeFileObject.includeAgg[includeAggIndex].name===_oSource.name&&_nodeFileObject.includeAgg[includeAggIndex].class===_oSource.class){
                        _add=false;
                        if(program.update){
                            includeConfig.updateSource(_nodeFileObject.includeAgg[includeAggIndex],_oSource);
                            break;
                        }else{
                            console.log( colors.yellow( 
                                `Add source "${_oSource.name}" Already exist! \nExisting documents ${includeAggIndex.name} path: ${includeAggIndex.path}  \nAdd parameter -update or --update if you need to update`
                            ));
                            break;
                        }
                    }
                }
            break;
            case 'string':
                _add=false;
                for (const includeAggIndex in _nodeFileObject.includeAgg) {
                    if(program.update === _nodeFileObject.includeAgg[includeAggIndex].name &&_oSource.class===_nodeFileObject.includeAgg[includeAggIndex].class){
                        includeConfig.updateSource(_nodeFileObject.includeAgg[includeAggIndex],_oSource);
                        break;   
                    } 
                }
                break;
            default:
                break;
        }
        if(_add){
            if(!_oSource.path) throw({code:commandErrorSign.symbolSourceFilePathNull});
            let _includeFileSourcePath =path.join('./',_oSource.path);

            try {
                let state=fs.statSync(_includeFileSourcePath,false);
                _oSource.ino=state.ino;
            } catch (error) {
                if(error.code==='ENOENT') throw({code:commandErrorSign.symbolSourceFileNonExis,path:_includeFileSourcePath})
                else throw(error)
            }

            for (const key in _oSource) {
                if (_oSource.hasOwnProperty(key)) {
                    const element = _oSource[key];
                    if(!element){
                        _oSource[key]=includeConfig.objSourceKeyDefaultValue[key];
                    }
                }
            }

            _nodeFileObject.includeAgg.push(_oSource);
            console.log(colors.green('add new source:'),_oSource);
        }
    }
    let _fid=fs.openSync(_nodePath,'r+');
    fs.ftruncateSync(_fid);
    fs.writeSync(_fid,JSON.stringify(_nodeFileObject)); 
    fs.closeSync(_fid);
    console.log(colors.green('\nCurrent node:'),colors.gray(_nodeFileObject));
   
} catch (error) {
    switch (error.code) {
        case commandErrorSign.symbolSourceFileNonExis:
            console.error(`File ./${error.path} is Non exis`);
            break;
        case commandErrorSign.symbolSourceFilePathNull:
            console.error(`Path is NULL`);
            break;
        default:
            console.error(error);
    }
}
// program.command('source <path>','add include source files',{executableFile: 'command-source'})
// program.parse(program.argv);