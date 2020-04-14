const fs=require('fs')
const path=require('path')
const includeConfig=require('./command-include-config')
const colors = require('colors/safe');
const program = require('commander');
const func =require('./functions');

// const readlineSync = require('readline-sync');
// const moment = require('moment');

const globalwhelltoolConfig = require('./wheeltoolConfig')
const globalwhelltoolFunc=require('./wheeltoolFunctions')
program.option('-all, --all','select all')
program.option('-push, --pushCenter [option]','Push pack to global Center Use `new` parameter to submit only the current or latest package content')
program.parse(process.argv);
let _nodeContent=JSON.parse(fs.readFileSync(includeConfig.getNodeFilePath()).toString());
function packAgg(agg){
    func.createDefaultDir(includeConfig.getNodeCachePackDir());
    //Pollution prevention read Node
    let _packNodeContent=JSON.parse(fs.readFileSync(includeConfig.getNodeFilePath()).toString());
    let _allAgg={};
    for (const aggValue of agg) {
        let _fileContent;
        try {
            _fileContent=fs.readFileSync(path.join('./',aggValue.path));
        } catch (error) {
            if(error.code){
                console.error(`File Path: ${aggValue.path} Name: ${aggValue.name} Class: ${aggValue.class} . Unsuccess Pack`);
                continue;
            }else{
                throw(error)
            }
        }
        let _saveName=includeConfig.createCacheFileName(aggValue.path,aggValue.class,aggValue.name);
        let _saveObj={
            path:path.join(includeConfig.getNodeCachePackDir(),_saveName),
            name:aggValue.name,
            class:aggValue.class,
            brief:aggValue.brief
        };
        fs.writeFileSync(_saveObj.path,_fileContent);
        _allAgg[`${_saveObj.class}-${_saveObj.name}`]=_saveObj;
    }
    _packNodeContent.cacheSource.push(_allAgg);
    fs.writeFileSync(includeConfig.getNodeFilePath(),JSON.stringify(_packNodeContent));
}
let outPackAggInfo=(_obj,_error)=>{
    console.log('\tPack Name: ',colors.green(_obj.name),' Class: ',colors.green(_obj.class),' Available: ', _error===false?colors.green('normal'):colors.red(`${_error}`));
};

if(program.all){
    console.log(_nodeContent);
    console.log('Pack List:');
    packAgg(_nodeContent.includeAgg.filter((value)=>{
        try {
            fs.statSync(value.path);
            outPackAggInfo(value,false)
            return true;
        } catch (error) {
            outPackAggInfo(value,error.code)
            return false;
        }
        
    }));
}else{
    let arrPackAgg=func.analyClassName(program.args,includeConfig.objSourceKeyDefaultValue.class);
    if(arrPackAgg.length){
        console.log('Pack List:');
        arrPackAgg=arrPackAgg.filter((value)=>{
            for (const includeAggValue of _nodeContent.includeAgg) {
                if(
                    value.class===includeAggValue.class&&
                    value.name===includeAggValue.name
                ){
                    value=Object.assign(value,includeAggValue);
                    try {
                        fs.statSync(value.path);
                        outPackAggInfo(value,false)
                        return true;
                    } catch (error) {
                        outPackAggInfo(value,error.code)
                        return false;
                    }
                }
            }
            console.log(colors.red(`\tName: ${value.name} Class: ${value.class} Include not found !`) )
            return false;
        })
        if(arrPackAgg.length){
            console.log(arrPackAgg);
            packAgg(arrPackAgg);
        }else{
            console.error('There is no source to package')
        }
    }
}

if(program.pushCenter){
    let objNodeContent=JSON.parse(fs.readFileSync(includeConfig.getNodeFilePath()).toString());
    let objCacheSourceAgg;
    switch(program.pushCenter){
        case true:
            objCacheSourceAgg=Object.assign({},...objNodeContent.cacheSource);
            break;
        case 'new':
            objCacheSourceAgg=Object.assign({},objNodeContent.cacheSource.slice(-1)[0] );
            break;
        default:
            console.error(`UnOption \`${program.pushCenter}\` from \`pushCenter\``);
            process.exit(1);
            break;
    }
    let ObjCoreContent=JSON.parse(globalwhelltoolFunc.readCoreContent());


    for (const Index in objCacheSourceAgg) {
        if(objCacheSourceAgg.hasOwnProperty(Index)){
            console.log(colors.green(`Push ${objCacheSourceAgg[Index].class}-${objCacheSourceAgg[Index].name} from_path: ${objCacheSourceAgg[Index].path}`))
            let bitReadContent=fs.readFileSync(objCacheSourceAgg[Index].path)
            objCacheSourceAgg[Index].path=path.join(globalwhelltoolConfig.strGlobalSourceLibDirPath,globalwhelltoolConfig.createGlobalLibFileName(
                objNodeContent.uid,
                objCacheSourceAgg[Index].class,
                objCacheSourceAgg[Index].name,
                path.basename(objCacheSourceAgg[Index].path).split('@')[0],
            ))
            fs.writeFileSync(
                objCacheSourceAgg[Index].path,
                bitReadContent
            );
        }
    }
    if(ObjCoreContent.hasOwnProperty(objNodeContent.uid)){
        // merge global and cache
        let objSaveSourceAgg=Object.assign(
            {},
            ObjCoreContent[objNodeContent.uid].sourceAgg,
            objCacheSourceAgg
        );
        Object.assign(
            ObjCoreContent.libraryAgg[objNodeContent.uid],
            globalwhelltoolConfig.outputLibObject(
                objNodeContent.uid,
                path.resolve('./'),
                objSaveSourceAgg
            )
        )
    }else{
        ObjCoreContent.libraryAgg[objNodeContent.uid]= globalwhelltoolConfig.outputLibObject(
            objNodeContent.uid,
            path.resolve('./'),
            objCacheSourceAgg
        )
    }
    globalwhelltoolFunc.writeCoreContent(JSON.stringify(ObjCoreContent));
    console.log(colors.green(`Success writeCore write count ${Object.keys(objCacheSourceAgg).length} !`));
}