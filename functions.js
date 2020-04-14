const fs =require('fs')
const _rootConfig=require('./root')
const path =require('path')
const readline = require('readline');
function createDefaultFile(path,defaultContent){
    let _path=path;
    let _fid=null;
    let _r=true;
    try {
        _fid=fs.openSync( _path ,'r+' );
    } catch (error) {
        _r= false;
        if(error.code==='ENOENT'){
            _fid=fs.openSync(_path,'a+');
            fs.writeSync(_fid,defaultContent) 
        }
    }
    fs.closeSync(_fid);
    return _r;
}


function createDefaultDir(_path){
    try {
        let _i=fs.statSync(_path);
        if(_i.isDirectory()){
            return false;
        }else{
            console.error('Create dir error',_path,' is File!');
            process.exit(1);
        }
    }catch(error){
        if(error.code==='ENOENT'){
            fs.mkdirSync(_path,{recursive:true});
            return true;
        }else{
            throw(error);
        }
    }
}



function ergoDir(_agg,_route){
    for (const strFileName of fs.readdirSync(_route)) {
        const strFilePath=path.join(_route,strFileName);
        const info=fs.statSync(strFilePath);
        if(info.isDirectory()){
            ergoDir(_agg,strFilePath) 
        }else{
            _agg.push({
                name:strFileName,
                path:strFilePath,
                ino:info.ino,
            });
        }
    }
}

function getFileTypeName(_fileName){
    let typeName=/\.([^\./\\]*?)$/.exec(_fileName);
    return (typeName[1]===undefined||typeName===null?'':typeName[1]);
}


function analyClassName(agg,defaultClass=null){
    let _r=[];
    let _a;
    for (const aggValue of agg) {
        _a=aggValue.split('-');
        if(_a.length===2){
            _r.push({
                class:_a[0],
                name:_a[1]
            });
        }else{
            _r.push({
                class:defaultClass,
                name:_a[0]
            });
        }
    }
    return _r;
}

 
module.exports={
    createDefaultFile,
    createDefaultDir,
    ergoDir,
    getFileTypeName,
    analyClassName
}