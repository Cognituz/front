const {API_URL} = require('config');

module.exports = (
  RailsResource,
  railsSerializer
) => {
  'ngInject';

  class StudySubject extends RailsResource {}

  StudySubject.configure({
    url:  `${API_URL}/v1/study_subjects`,
    name: 'study_subject'
  });

  return StudySubject;
};
