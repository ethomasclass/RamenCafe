/* ===========================================================================
   build-single.js — squash the game into one self-contained HTML file.

       node tools/build-single.js            -> dist/ramen-talk.html
       node tools/build-single.js --fragment -> dist/ramen-talk.fragment.html

   The full file is what you hand somebody who wants to open the game from a
   USB stick or drop it into a learning-management system that only accepts
   one file. The fragment is the same thing without the <!doctype>, <html>,
   <head> and <body> wrappers, for hosts that supply their own.

   Nothing is minified. The point is that a teacher can open the result and
   still read it.
   =========================================================================== */

var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');
var html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

/* the stylesheet, inlined */
html = html.replace(/<link rel="stylesheet" href="css\/style\.css">/,
  '<style>\n' + fs.readFileSync(path.join(root, 'css/style.css'), 'utf8') + '\n</style>');

/* every local script, inlined in the order the page lists them */
html = html.replace(/<script src="(js\/[^"]+)"><\/script>/g, function (_, src) {
  return '<script>\n' + fs.readFileSync(path.join(root, src), 'utf8') + '\n</script>';
});

var fragment = process.argv.indexOf('--fragment') !== -1;
var out = 'ramen-talk.html';

if (fragment) {
  out = 'ramen-talk.fragment.html';
  var head = html.slice(html.indexOf('<head>') + 6, html.indexOf('</head>'));
  var body = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>'));
  /* keep the title and the font links; drop the charset and viewport, which
     the host supplies itself */
  head = head.split('\n').filter(function (l) {
    return !/<meta /.test(l);
  }).join('\n');
  html = head.trim() + '\n' + body.trim() + '\n';
}

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', out), html);
console.log(out + ' — ' + Math.round(html.length / 1024) + ' KB');
