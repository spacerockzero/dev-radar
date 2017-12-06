// deps
require('mocha');
const { expect } = require('chai');
const Article = require('../article');

describe('Article constructor', () => {
  describe('should build a valid object', () => {
    const article = new Article({
      title: 'A good article',
      link: 'https://www.jakobanderson.com',
      feedsrc: 'hackernews',
      labels: ['performance', 'nodejs'],
    });
    it('should exist', () => expect(article).to.exist);
    it('should be an object', () => expect(article).to.be.an('Object'));
    it('should have a title', () => expect(article.title).to.equal('A good article'));
    it('should have a link', () => expect(article.link).to.equal('https://www.jakobanderson.com'));
    it('should have a feedsrc', () => expect(article.feedsrc).to.equal('hackernews'));
    it('should have labels', () => expect(article.labels).to.eql(['performance', 'nodejs']));
    it('should have a createdOn date', () => expect(article.createdOn).to.be.an.instanceOf(Date));
  });
});
