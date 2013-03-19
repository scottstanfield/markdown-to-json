#!/usr/bin/env node

var program = require('commander'),
    moment = require('moment'),
    path = require('path'),
    yaml = require('yaml-front-matter');

program
    .version(require('../package.json').version)
    .usage('[options] <files>')
    .option('-w --width <int>', 'max width of preview text [70]', Number, 70)
    .parse(process.argv);


// Truncate a string and add a horizontal ellipses after n charcters
String.prototype.truncate =
    function(n) {

        //   ^\s+.{0,25}\s      tested at http://regexpal.com
        var p  = new RegExp("^\\s+.{0," + n + "}\\s", 'g');
        var re = this.match(p);
        var l  = re[0].length;

        if (l < this.length) 
            return re + '…'; // or consider '&hellip;';
    };

// Side effects:
// - Root node of JSON is files key mapping to a dictionary of files
// - .preview will be first 50 characters of the raw content (not translated)
// - .__content is removed (potentially too large)
// - if .date is detected, a formated date is added as .dateFormatted

json = { "files": [] }

program.args.forEach(function(filename) {
    var metadata = yaml.loadFront(filename);
    if (metadata)
    {
        // Max of 50 chars, snapped to word boundaries, and trim leading whitespace
        metadata.preview = metadata["__content"].truncate(program.width).replace(/^\s+/,'');

        // yaml-front-matter adds all the content; we'll just use our preview
        delete metadata["__content"];

        // map user-entered date to a better one using moment's great parser
        if (metadata.date) 
            metadata.iso8601Date = moment(metadata.date).format();

        metadata.basename = path.basename(filename);

        json.files.push(metadata);
    }
});

process.stdout.write(JSON.stringify(json, undefined, 2));
process.stdout.write("\n");

