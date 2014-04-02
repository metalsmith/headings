
var assert = require('assert');
var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var headings = require('..');

describe('metalsmith-headings', function(){
  it('should parse headings from HTML', function(done){
    Metalsmith('test/fixture')
      .use(markdown())
      .use(headings({ selectors: ['h2'] }))
      .build(function(err, files){
        if (err) return done(err);
        assert.deepEqual(files['index.html'].headings, [
          { id: 'two-one', text: 'two one' },
          { id: 'two-two', text: 'two two' }
        ]);
        done();
      });
  });

  it('should accept a string shorthand', function(done){
    Metalsmith('test/fixture')
      .use(markdown())
      .use(headings('h2'))
      .build(function(err, files){
        if (err) return done(err);
        assert.deepEqual(files['index.html'].headings, [
          { id: 'two-one', text: 'two one' },
          { id: 'two-two', text: 'two two' }
        ]);
        done();
      });
  });
});
