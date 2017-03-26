module.exports = () => class {
  serialize(value) { return value; }

  deserialize(jsonDate) {
    return angular.isDate(jsonDate) ? jsonDate : new Date(jsonDate);
  }
};
