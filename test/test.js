var should = require('should');
var glob = require('glob');

describe('markdown-to-json', function() {

    var m2j = require('../lib/m2j.js'),
        fs = require('fs'),
        options,
        results;

    beforeEach(function() {
        options = {
            pretty: true,
            width: 70,
            outfile: null
        };
        results = null;
    });

    describe('pretty', function() {
        it('should parse bellflower.md', function() {
            var results = m2j.parse(['test/fixtures/bellflower.md'], options);
            var json = fs.readFileSync('test/fixtures/output/bellflower-pretty-70.json', 'utf8').trim();
            results.trim().should.equal(json);
        });
    });

    describe('not pretty', function() {
        it('should parse bellflower.md without pretty flag', function() {
            options.pretty = false;
            var results = m2j.parse(['test/fixtures/bellflower.md'], options);
            var json = fs.readFileSync('test/fixtures/output/bellflower-nopretty-70.json', 'utf8').trim();
            results.trim().should.equal(json);
        });
    });

    describe('all files', function() {
        it('should parse all files', function() {
            glob('test/fixtures/*.md', function(er, files) {
                var results = m2j.parse(files, options);
                var json = fs.readFileSync('test/fixtures/output/allfiles.json', 'utf8').trim();
                results.trim().should.equal(json);
            });
        });
    });

    describe('with 30 character width', function() {
        it('should parse lottery with preview max at 30', function() {
            options.width = 30;
            var results = m2j.parse(['test/fixtures/lottery.md'], options);
            var json = fs.readFileSync('test/fixtures/output/lottery-pretty-30.json', 'utf8').trim();
            results.trim().should.equal(json);
        });
    });

}); 
