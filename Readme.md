
# metalsmith-headings

  A Metalsmith plugin that extracts headings from HTML files and attaches them to the file's metadata.

## Installation

    $ npm install metalsmith-headings

## Example

```js
var Metalsmith = require('metalsmith');
var headings = require('metalsmith-headings');

Metalsmith(__dirname)
  .use(headings('h2'))
  .build();
```

### Enhanced mode (Markdown)

Use an array and even decide, if it should already parse your Markdown files:

```js
var Metalsmith = require('metalsmith');
var headings = require('headings');
var markdown = require('metalsmith-markdown');

Metalsmith(__dirname)
  .use(headings({
    mode: 'md',         // set to anything else or remove this property for HTML-mode
    selectors: ['h1', 'h2'],
  }))
  .use(markdown())      // Invoke this function somewhere after 'headings'
  .build();
```

Bear in mind to include this function somewhere before your `.use(markdown())` function.  
Otherwise, `metalsmith` would compile your files into HTML before it would extract your headings.

One other thing to mention would be that `mode: 'md'` orders your headings according their position the `selectors` array in the options object, whereas the *legacy* HTML-mode orders your headings according to their position in your files. You choose.

## License

  MIT