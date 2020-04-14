const fs= require('fs')
// const path = require('path')
const globalConfig = require('./wheeltoolConfig')
const _rootConfig=require('./root')
const path=require('path')

function initGlobalMainRootDir(){
    try {
        fs.accessSync(globalConfig.strGlobalMainPath,fs.F_OK)
    } catch (error) {
        if (error.code==='ENOENT')
            fs.mkdirSync(globalConfig.strGlobalMainPath,{recursive:true},(err)=>{
                if(err) throw err
            })
        else{
            throw error 
        }
    }
}




function readCoreContent(){
    return  fs.readFileSync(globalConfig.strGlobalCoreConPath).toString();
}
function writeCoreContent(Content){
    return fs.writeFileSync(globalConfig.strGlobalCoreConPath,Content);
}

function createGlobaMainCoreFile(){
    let _fid=fs.openSync(globalConfig.strGlobalCoreConPath,'a');
    fs.writeSync(_fid,JSON.stringify(globalConfig.outputInitGlobalConfigObject()));
    return _fid
}


function initGlobalMainCoreFile(){
    let _fid=null;
    try{
        _fid=fs.openSync(globalConfig.strGlobalCoreConPath,'r+')
        let _contentObject=JSON.parse(readCoreContent());
        if(_contentObject.version!==globalConfig.strVersion){
            let _newContent=JSON.stringify(Object.assign(globalConfig.outputInitGlobalConfigObject(),_contentObject));
            fs.ftruncateSync(_fid);
            fs.writeSync(_fid,_newContent);
        }
    }catch(error){
        try {fs.closeSync(_fid)} catch{}
        if(error.code==='ENOENT'){
            _fid=createGlobaMainCoreFile();
        }else{
             throw error;
        }
    }
    fs.closeSync(_fid);
}

function initGlobalLib(){
    let strLibPath=globalConfig.strGlobalSourceLibDirPath;
    try {
        fs.statSync(strLibPath);
    } catch (error) {
        if(error.code==='ENOENT'){
            fs.mkdirSync(strLibPath)
        }else{
            throw(error)
        }
    }
}

function initGlobal(){
    initGlobalMainRootDir();
    initGlobalMainCoreFile();
    initGlobalLib();
}



module.exports={
    initGlobal,
    readCoreContent,
    writeCoreContent
}