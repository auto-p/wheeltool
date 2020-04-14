const fs=require('fs')
const path=require('path')
const includeConfig=require('./command-include-config')
const colors = require('colors/safe');
const program = require('commander');
program.option('-all,--all','Show the whole document');
program.parse(process.argv);
let _includeNodePath=path.join('./',includeConfig.getNodeFilePath());
let _objContent=JSON.parse(fs.readFileSync(_includeNodePath).toString());
if(program.all){
    console.dir(_objContent,{depth:4,colors:true})
}else{
    console.log(colors.green('Include Source Agg: '),_objContent.includeAgg,colors.green('\n\nversion: '),_objContent.version);
}
// functions.createDefaultFile(
//     _includeNodePath,
//     JSON.stringify(includeConfig.createNodeStruct())
// )
// if(program.clear){
//     fs.truncateSync(_includeNodePath)
//     fs.writeFileSync(_includeNodePath,JSON.stringify(includeConfig.createNodeStruct()) )
//     console.log( colors.green(`Clear ${_includeNodePath} Success !`))
// }
// console.log( colors.grey(`Init ${_includeNodePath}`))
