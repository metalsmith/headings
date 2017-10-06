
var cheerio = require('cheerio');
var debug = require('debug')('metalsmith-headings');
var extname = require('path').extname;
var slug = require('slug');

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Filters selectors out of a Markdown file
 * @param {Object} data 
 * @param {string[]} selectors 
 */
function filterMarkdown(data, selectors) {
  const headers = {
    h1: /^#{1}\s+(.+?)$/gim,
    h2: /^#{2}\s+(.+?)$/gim,
    h3: /^#{3}\s+(.+?)$/gim,
    h4: /^#{4}\s+(.+?)$/gim,
    h5: /^#{5}\s+(.+?)$/gim,
    h6: /^#{6}\s+(.+?)$/gim,
  };
  const regexes = selectors.map((selector) => headers[selector]).filter((entry) => entry !== null || typeof entry !== 'undefined');
  const contents = data.contents.toString();
  data.headings = [];

  regexes.forEach((regex, index) => {
    let found;
    while ((found = regex.exec(contents)) !== null) {
      if (found.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      if (found[1].length) {
        data.headings.push({
          id: slug(found[1]),
          tag: selectors[index],
          text: found[1],
        });
      }
    }
  });
  return data;
}

/**
 * Filters selectors out of an HTML file
 * @param {Object} data the file object
 * @param {string[]} selectors The selectors array
 */
function filterHTML(data, selectors) {
  var contents = data.contents.toString();
  var $ = cheerio.load(contents);
  data.headings = [];
  $(selectors.join(',')).each(function() {
    data.headings.push({
      id: $(this).attr('id'),
      tag: $(this)[0].name,
      text: $(this).text()
    });
  });
  return data;
}

/**
 * Get the headings from any html files.
 *
 * @param {String or Object} options (optional)
 *   @property {Array} selectors
 */
function plugin(options) {
  if ('string' == typeof options) options = { selectors: [options] };
  options = options || { };
  var selectors = options.selectors || ['h2'];

  return function(files, metalsmith, done){
    setImmediate(done);
    Object.keys(files).forEach(function(file) {
      var data = files[file];
      debug(`Currently processing: ${file}\nMode: ${options.mode || 'html (default)'}`);
      if (options.mode !== 'md' && '.html' === extname(file)) {
        data = filterHTML(data, selectors);
      }
      if (options.mode === 'md' && '.md' === extname(file)) {
        data = filterMarkdown(data, selectors);
      }
      debug(`Found: ${data.headings.length} headings.`);
      return;
    });
  };
}