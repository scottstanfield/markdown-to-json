(function(){
'use strict';

var moment = require('moment'),
    truncate = require('lodash.truncate'),
    path = require('path'),
    fs = require('fs'),
    yaml = require('yaml-front-matter');

// Side effects:
// - Root node of JSON is files key mapping to a dictionary of files
// - .preview will be first WIDTH characters of the raw content (not translated), if width is not 0
// - .__content is removed (potentially too large)
// - if .date is detected, a formated date is added as .dateFormatted

function processFile(filename, width, content)
{
    var _basename = path.basename(filename, path.extname(filename));
    var _metadata = yaml.loadFront(filename);

    if (_metadata)
    {
        // If width is truthy (is defined and and is not 0).
        if (width) {
          //Max of WIDTH chars, snapped to word boundaries, and trim leading whitespace
          var truncate_options = {length: width, separator: /\s/, omission: ' …'};
          _metadata.preview = truncate(_metadata['__content'].trim(), truncate_options);
        }

        // If the command line option is provided keep the entire content in field 'content'
        if (typeof(content) != "undefined")
        {
          _metadata['content'] = _metadata['__content'];
        }

        delete _metadata['__content'];

        // map user-entered date to a better one using moment's great parser
        if (_metadata.date) {
            _metadata.iso8601Date = moment(_metadata.date).format();
        }

        _metadata.basename = _basename;
    }

    return {
        metadata: _metadata,
        basename: _basename
    };
}

exports.parse = function(filenames, options)
{
    // http://i.qkme.me/3tmyv8.jpg
    var parse_all_the_files = {};
    // http://i.imgur.com/EnXB9aA.jpg

    filenames.forEach(function(f) {
        if(fs.lstatSync(f).isDirectory()) {
            var dir = f;
            filenames = fs.readdirSync(f);
            filenames.forEach(function(f2) {
                f2 = dir + "/" + f2;
                var m = processFile(f2, options.width, options.content);
                parse_all_the_files[m.basename] = m.metadata;
            });
        } else {
            var m = processFile(f, options.width, options.content);
            parse_all_the_files[m.basename] = m.metadata;
        }
    });

    var json;

    if (options.minify)
        json = JSON.stringify(parse_all_the_files);
    else
        json = JSON.stringify(parse_all_the_files, null, 2) + '\n';

    if (options.outfile) {
        var file = fs.openSync(options.outfile, 'w+');
        fs.writeSync(file, json);
        fs.closeSync(file);
        return;
    } else {
        return json;
    }
};
})();

