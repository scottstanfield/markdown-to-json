#!/usr/bin/env node

var program = require('commander'),
    yaml = require('yaml-front-matter');

var log = console.log
program
    .version('1.0.0')
    .usage('[options] <files>')
    .parse(process.argv);

rfc822 = function(date) {
  var days, months, pad, time, tzoffset;
  pad = function(i) {
    if (i < 10) {
      return '0' + i;
    } else {
      return i;
    }
  };
  tzoffset = function(offset) {
    var direction, hours, minutes;
    hours = Math.floor(offset / 60);
    minutes = Math.abs(offset % 60);
    direction = hours > 0 ? '-' : '+';
    return direction + pad(Math.abs(hours)) + pad(minutes);
  };
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', ' Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  time = [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds())].join(':');
  return [days[date.getDay()] + ',', pad(date.getDate()), months[date.getMonth()], date.getFullYear(), time, tzoffset(date.getTimezoneOffset())].join(' ');
};

String.prototype.trunc = 
      function(n){
          return this.substr(0,n-1)+(this.length>n?'&hellip;':'');
      };


var json;
json = { "files": [] }

program.args.forEach(function(filename) {
    var fileJson = yaml.loadFront(filename);
    if (fileJson)
    {
        fileJson.preview = fileJson["__content"].trunc(50);
        delete fileJson["__content"];
        fileJson.rfc822 = rfc822(new Date(fileJson.date));
        json.files.push(fileJson);
    }
});

log(JSON.stringify(json, undefined, 2));

