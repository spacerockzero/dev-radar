// deps
require('mocha');
const chai = require('chai');
const expect = chai.expect;
const pify = require('pify');
const fs = require('fs');
const path = require('path');
const jsync = require('asyncawait/async');
const jwait = require('asyncawait/await');
const nock = require('nock');

// our lib
const feedUtils = require('../feed-utils');

// mocks
const sources = require('./mocks/sources-mock');
const jsonMock = require('./mocks/feeds-json-mock');

describe('getFeeds', function() {
  this.timeout(10000);
  // get feeds, flatten content, add feedsrc
  let flatFeeds;

  before(done => {
    feedUtils
      .getFeeds(sources)
      .then(flat => {
        flatFeeds = flat;
        // console.log(flatFeeds);
        done();
      })
      .catch(err => {
        console.error(err);
        done();
      });
  });
  after(() => {
    flatFeeds = null;
  });

  describe('should have required fields:', () => {
    it('title', () => expect(flatFeeds[0].title).to.exist);
    it('link', () => expect(flatFeeds[0].link).to.exist);
    it('feedsrc', () => expect(flatFeeds[0].feedsrc).to.exist);
  });
});

describe('cleanObjects', () => {
  // trim extra chars from some fields
  // return the part we need
  let cleanJSON;
  // console.log(jsonMock);
  before(() => {
    cleanJSON = feedUtils.cleanObjects(jsonMock);
  });
  after(() => {
    cleanJSON = null;
  });

  describe('should have required fields:', () => {
    it('title', () => expect(cleanJSON[0].title).to.exist);
    it('link', () => expect(cleanJSON[0].link).to.exist);
    it('feedsrc', () => expect(cleanJSON[0].feedsrc).to.exist);
  });

  describe('should have removed extra chars', () => {
    it('in title', () => expect(cleanJSON[0].title).to.have.length(80));
    it('in link', () => expect(cleanJSON[0].link).to.have.length(40));
  });

  describe('should have added feedsrc', () => {
    it('exists', () => expect(cleanJSON[0].feedsrc).to.exist);
    it('correct value', () => expect(cleanJSON[0].feedsrc).to.equal('Echo JS'));
  });
});

describe('processFlow', function() {
  this.timeout(10000);
  // orchestrate whole feed-getting, filtering and returning json thing
  let content;

  before(done => {
    // deps
    require('mocha');
    const chai = require('chai');
    const expect = chai.expect;
    feedUtils
      .processFlow(sources)
      .then(data => {
        content = data;
        done();
      })
      .catch(err => {
        console.log(err);
        done();
      });
  });
  after(() => {
    content = null;
  });

  describe('should return content', () => {
    it('should be an array', () => expect(content).to.be.an('Array'));
    it('should contain objects', () => expect(content[0]).to.be.an('Object'));
    it('should have the right length', () => expect(content).to.have.length(59));
  });

  describe('should have required fields:', () => {
    it('title', () => expect(content[0].title).to.exist);
    it('link', () => expect(content[0].link).to.exist);
    it('feedsrc', () => expect(content[0].feedsrc).to.exist);
  });
});
