/* eslint-env node */
'use strict';

const moment = require('moment');
const truncate = require('lodash.truncate');
const path = require('path');
const fs = require('fs');
const yaml = require('yaml-front-matter');

// Side effects:
// - Root node of JSON is files key mapping to a dictionary of files
// - .preview will be first WIDTH characters of the raw content
//   (not translated), if width is not 0
// - .__content is removed (potentially too large)
// - if .date is detected, a formated date is added as .dateFormatted

const processFile = function(filename, width, content) {
    const _basename = path.basename(filename, path.extname(filename));
    const _metadata = yaml.loadFront(filename);

    if (_metadata) {
        // If width is truthy (is defined and and is not 0).
        if (width) {
          // Max of WIDTH chars snapped to word boundaries, trim whitespace
          const truncateOptions = {
            length: width,
            separator: /\s/,
            omission: ' …',
          };
          _metadata.preview = truncate(
            _metadata['__content'].trim(), truncateOptions);
        }

        // If the option is provided keep the entire content in field 'content'
        if (typeof(content) != 'undefined') {
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
        basename: _basename,
    };
};

exports.parse = function(filenames, options) {
    // http://i.qkme.me/3tmyv8.jpg
    const parseAllTheFiles = {};
    // http://i.imgur.com/EnXB9aA.jpg

    filenames.forEach(function(f) {
        if(fs.lstatSync(f).isDirectory()) {
            const dir = f;
            filenames = fs.readdirSync(f);
            filenames.forEach(function(f2) {
                f2 = dir + '/' + f2;
                const m = processFile(f2, options.width, options.content);
                parseAllTheFiles[m.basename] = m.metadata;
            });
        } else {
            const m = processFile(f, options.width, options.content);
            parseAllTheFiles[m.basename] = m.metadata;
        }
    });

    let json;

    if (options.minify)
        json = JSON.stringify(parseAllTheFiles);
    else
        json = JSON.stringify(parseAllTheFiles, null, 2) + '\n';

    if (options.outfile) {
        const file = fs.openSync(options.outfile, 'w+');
        fs.writeSync(file, json);
        fs.closeSync(file);
        return;
    } else {
        return json;
    }
};
