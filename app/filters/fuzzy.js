const Fuse = require('fuse.js');

module.exports = () =>
  (array, searchTerm) => {
    if (!searchTerm || searchTerm === '') return array
    const fuse  = new Fuse(array, {threshold: 0.5});
    return fuse.search(searchTerm).map(i => array[i]);
  }
