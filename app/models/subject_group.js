module.exports = (
  RailsResource,
  railsSerializer
) => {
  'ngInject';

  class SubjectGroup extends RailsResource {}

  SubjectGroup.configure({
    url:  'http://localhost:3000/v1/subject_groups',
    name: 'subject_group'
  });

  return SubjectGroup;
};
