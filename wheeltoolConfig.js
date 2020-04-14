const _rootConfig=require('./root')
const path = require('path')
const os = require('os')
const strName='wheeltool'
const strCoreConFileName='coreCon.json'
const strVersion='0.0.3';
const strSourceLibDirName='sourceLibrary'

const strGlobalMainPath=path.resolve(os.homedir(),`./${strName}`);
const strGlobalCoreConPath=path.resolve(strGlobalMainPath,`./${strCoreConFileName}`);
const strGlobalSourceLibDirPath=path.resolve(strGlobalMainPath,`./${strSourceLibDirName}`);
function outputInitGlobalConfigObject(){
    return {
        name:strName,
        libraryAgg:{},
        version:strVersion,
        lastModified:Date.parse(new Date())
    };
}
function outputLibObject(uid,fromPath,sourceAgg){
    return {
        uid:uid,
        fromPath:fromPath,
        sourceAgg:sourceAgg
    }
}
function createGlobalLibFileName(uid,libClass,libName,fileName){
    return `${uid}@${libClass}-${libName}@${fileName}`;
}
function createGetOutputFileName(dateTime,uid,libClass,libName,fileName){
    return `${dateTime}@${uid}@${libClass}-${libName}@${fileName}`
}

module.exports={
    strName,
    strCoreConFileName,
    strGlobalMainPath,
    strGlobalCoreConPath,
    strVersion,
    strSourceLibDirName,
    strGlobalSourceLibDirPath,
    outputInitGlobalConfigObject,
    outputLibObject,
    createGlobalLibFileName,
    createGetOutputFileName
}