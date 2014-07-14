module.exports = ( function(){
    'use strict';

    var stream = process.stderr,
        logger = require('./logger'),
        output = {};

    output.welcome = function(){
        logger.notice('');
        logger.notice('                      ___ --.');
        logger.notice('                    .`   \'.  \\');
        logger.notice('               ,_          | |');
        logger.notice('         .""""""|\'.""""""-./-;');
        logger.notice('       |__.----| \\ \'.      |0 \\');
        logger.notice('    __/ /  /  /|  \\  \'.____|__|');
        logger.notice('    `""""""""`"|`""\'---\'|  \\');
        logger.notice('           .---\'        /_  |_');
        logger.notice('');
    };

    output.progress = function(options){
        var currIndex = 0;

        function tick(){
            var smallChar = '･',
                largeChar = '●',
                size = 5,
                out = '',
                str = (options.label || '') + ' ';

            if (!stream.isTTY) {
                return;
            }

            if(currIndex === size) {
                currIndex = 0;
            }

            for(var x = 0; x < size; x++ ){
                str += (x === currIndex) ? largeChar : smallChar;
            }

            if (out !== str) {
                stream.clearLine();
                stream.cursorTo(0);
                stream.write(str);
                out = str;
                currIndex++;
            }
        }


        return setInterval(tick, 500);
    };


    return output;

} )();