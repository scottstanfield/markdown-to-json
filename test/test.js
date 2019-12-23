/* eslint no-unused-vars: "off" */
const should = require('should');
const glob = require('glob');

describe('markdown-to-json', function() {
  const m2j = require('../lib/m2j.js');
  const fs = require('fs');
  let options;

  beforeEach(function() {
    options = {
      minify: false,
      width: 70,
      outfile: null,
    };
  });

  describe('pretty', function() {
    it('should parse bellflower.md with crlf', function() {
      const results = m2j.parse(['test/fixtures/bellflower.md'], options);
      const json = fs.readFileSync('test/fixtures/output/bellflower-pretty-70.json', 'utf8').trim();
      results.trim().should.equal(json);
    });
  });

  describe('on short strings', function() {
    it('should return all the markdown content since it is smaller than width', function() {
      const results = m2j.parse(['test/fixtures/short-content.md'], options);
      const obj = JSON.parse(results);
      obj.should.have.property('short-content');

      const metadata = obj['short-content'];
      metadata.should.have.property('preview', 'This would make a great article.');
    });
  });

  describe('no yaml', function() {
    it('should return empty object on file with no yaml to parse', function() {
      options.minify = true;
      const results = m2j.parse(['test/fixtures/no-yaml.md'], options);
      JSON.parse(results).should.have.property('no-yaml');

      const obj = JSON.parse(results)['no-yaml'];

      obj.should.have.property('preview');
      obj.should.have.property('basename');
    });
  });

  describe('minify', function() {
    it('should parse bellflower.md without newlines', function() {
      options.minify = true;
      const results = m2j.parse(['test/fixtures/bellflower.md'], options);
      const json = fs.readFileSync('test/fixtures/output/bellflower-nopretty-70.json', 'utf8').trim();
      results.trim().should.equal(json);
    });
  });

  describe('all files', function() {
    it('should parse all files', function() {
      glob('test/fixtures/*.md', function(er, files) {
        const results = m2j.parse(files, options);
        const json = fs.readFileSync('test/fixtures/output/allfiles.json', 'utf8').trim();
        results.trim().should.equal(json);
      });
    });
  });

  describe('with 30 character width', function() {
    it('should parse lottery with preview max at 30', function() {
      options.width = 30;
      const results = m2j.parse(['test/fixtures/lottery.md'], options);
      const json = fs.readFileSync('test/fixtures/output/lottery-pretty-30.json', 'utf8').trim();
      results.trim().should.equal(json);
    });
  });

  describe('with content flag enabled', function() {
    it('should return the entire content of a file', function() {
      options.width = 70;
      options.content = true;
      const results = m2j.parse(['test/fixtures/bellflower.md'], options);
      const json = fs.readFileSync('test/fixtures/output/bellflower-content.json', 'utf8').trim();
      results.trim().should.equal(json);
    });
  });
});
