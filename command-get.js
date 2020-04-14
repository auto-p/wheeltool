const program = require('commander');
program.command('source [getSource...]','use className-Name Get source',{executableFile:'command-get-source'})
program.command('show','Show source list',{executableFile:'command-get-show'})
program.parse(process.argv);