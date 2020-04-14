const path =require('path');
const md5 =require('md5-node')
const config =require('./wheeltoolConfig.js');
const _rootConfig=require('./root')
const func=require('./functions')
const moment=require('moment')
const strNodeFileDir='.wheeltool';
const strNodeFileName='wheeltoolInclude.json';
const strNodeCachePackDir='cachePack';
const objNodeStruct={
    includeAgg:[],
    version:null,
    cacheSource:[],
    uid:null
}
const objIncludeSourceStruct={
    name:'',
    brief:'',
    class:'',
    path:null,
    ino:null,
}
function createNodeStruct(){
    return Object.assign(
        {},
        objNodeStruct,
        {
            version:config.strVersion,
        },
        {
            uid:new Date().getTime()+md5(Math.random()+process.cwd())
        }
    )
}
function createIncludeSourceStruct(_co={}){
    let _o=Object.assign({},objIncludeSourceStruct,_co);
    return _o;
}
function getNodeFilePath(_root='./'){
    return path.join(_root,strNodeFileDir,strNodeFileName)
}
function getNodeCachePackDir(_root='./'){
    return path.join(path.dirname(getNodeFilePath(_root)),strNodeCachePackDir);
}



// const randomValAgg='QWEASDZXCRTYJKLP1234567890qwertyuiopasdfFGHVBNUIOghjklzxcvbnm'.split('');
// function randomIncludeSourceName(_name='this_is_file_',_length=null){
//     let _r=_name;
//     let factor=Math.random();
//     if(_length===null){
//         _length=4+Math.floor(Math.random()*(8+1))
//     }
//     for (let index = 1; index <=_length ; index++) {
//         _r+=randomValAgg[Math.floor(( (factor*index)%1  )*randomValAgg.length)];
//     }
//     return _r;
// }

const objSourceKeyDefaultValue={
    brief:'null_brief_info_content_in_file',
    class:'unclass',
}

function updateSource(_OriginalSource,_newSource){
    for (const key in _newSource) {
        if (_newSource.hasOwnProperty(key)) {
            const element = _newSource[key];
            if(element){
                _OriginalSource[key]=element
            }
        }
    }
    return _OriginalSource;
}
function createCacheFileName(filePath,sourceClass,sourceName){
    return `${path.basename(filePath)}@${sourceClass}-${sourceName}@${moment(Date.now()).format('YYYY-MM-DD-HH-mm-ss')}@.${func.getFileTypeName(filePath)}`;
}


module.exports={
    strNodeFileName,
    strNodeFileDir,
    objNodeStruct,
    objSourceKeyDefaultValue,
    createNodeStruct,
    createIncludeSourceStruct,
    getNodeCachePackDir,
    updateSource,
    getNodeFilePath,
    createCacheFileName
}