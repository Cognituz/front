const {API_URL} = require('config');

module.exports = (
  RailsResource,
  railsSerializer
) => {
  'ngInject';

  class SubjectGroup extends RailsResource {}

  SubjectGroup.configure({
    url:  `${API_URL}/v1/subject_groups`,
    name: 'subject_group'
  });

  return SubjectGroup;
};
