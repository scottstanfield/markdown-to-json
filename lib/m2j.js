var moment = require('moment'),
    path = require('path'),
    fs = require('fs'),
    yaml = require('yaml-front-matter');

// Truncate a string and add a horizontal ellipses after n charcters
String.prototype.truncate =
    function(n) {

        //   ^[\w\s]+.{0,25}\s      tested at http://regexpal.com
        var p  = new RegExp("^[\\w\\s]+.{0," + n + "}\\s", 'g');
        var re = this.match(p);
        var l  = re[0].length;

        if (l < this.length) 
            return re + '…'; // or consider '&hellip;';
        else
            return this;
    };

// Side effects:
// - Root node of JSON is files key mapping to a dictionary of files
// - .preview will be first 50 characters of the raw content (not translated)
// - .__content is removed (potentially too large)
// - if .date is detected, a formated date is added as .dateFormatted

function processFile(filename, width)
{    
    var _basename = path.basename(filename, path.extname(filename));
    var _metadata = yaml.loadFront(filename);

    if (_metadata)
    {
        // Max of 50 chars, snapped to word boundaries, and trim leading whitespace
        _metadata.preview = _metadata["__content"].truncate(width).replace(/^\s+/,'');

        // yaml-front-matter adds all the content; we'll just use our preview
        delete _metadata["__content"];

        // map user-entered date to a better one using moment's great parser
        if (_metadata.date) 
            _metadata.iso8601Date = moment(_metadata.date).format();

        _metadata.basename = _basename;

    }

    return { 
        metadata: _metadata,
        basename: _basename 
    }
}

exports.parse = function(filenames, options)
{
    // http://i.qkme.me/3tmyv8.jpg
    var parse_all_the_files = {};

    filenames.forEach(function(f) {
        var m = processFile(f, options.width);
        parse_all_the_files[m.basename] = m.metadata;
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
}




