const {API_URL} = require('config');

module.exports = (
  RailsResource,
  railsSerializer
) => {
  'ngInject';

  class ClassAppointment extends RailsResource {
    get cost() {
      return this.teacher && this.duration &&
        this.teacher.hourlyPrice * this.duration;
    }
  }

  ClassAppointment.configure({
    url:  `${API_URL}/v1/class_appointments`,
    name: 'class_appointment',
    serializer: railsSerializer(function() {
      this.nestedAttribute('attachments');
    })
  });

  return ClassAppointment;
};
