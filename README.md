# markdown-to-json

[![Build Status](https://travis-ci.org/scottstanfield/markdown-to-json.svg?branch=master)](https://travis-ci.org/scottstanfield/markdown-to-json)

Tool for converting YAML Front Matter in Markdown files to JSON files.

`m2j` is used to read a folder of Markdown files, pulling out the YAML
Front Matter from each, and saving it all as a JSON blob.

This is especially useful if you have a folder full of Markdown files
that you want scanned and processed into a single JSON file, which can
then be consumed by Angular on the client, cached in a Node server, or
saved in a NoSQL database.

In addition to moving the YAML to JSON, a few extra elements are created: 

-  `iso8601` [formatted][1] timestamp from `date` using [Moment.js][2]
-  `preview` is the first 70 or so characters of the actual raw Markdown content, with ellipses at the end
-  `basename` is the filename without the path or extension
-  `content` is created only if the content flag is enabled; raw Markdown content will be unabridged

_Example_

```
% m2j --help

  Usage: m2j [options] <files>

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -w --width <int>         max width of preview text [70]. Set to 0 for no preview.
    -p --pretty              format JSON with newlines
    -c --content             include the full content of the file unabridged
    -o --outfile <filename>  filename to save json to [output.json]


% m2j.js lottery.md
```

**lottery.md**

```md
---
title: The Lottery Ticket
author: Anton C.
date: "2013-03-15 15:00"
template: article.jade
tags:
  - Fiction
  - Russian

---

Ivan Dmitritch, a middle-class man who lived with his family on an income of twelve hundred a year and was very well satisfied with his lot, sat down on the sofa after supper and began reading the newspaper. 

```

**output**

```js
{
  "files": [
    {
      "title": "The Lottery Ticket",
      "author": "Anton C.",
      "date": "1893-04-01",
      "template": "article.jade",
      "tags": [
        "Fiction",
        "Russian"
      ],
      "preview": "Ivan Dmitritch, a middle-class man who lived with his family on an …",
      "iso8601Date": "1893-04-01T00:00:00-07:00",
      "basename": "lottery.md"
    }
  ]
}
```


[1]: https://en.wikipedia.org/wiki/ISO_8601
[2]: http://momentjs.com/docs/#/parsing/string/
