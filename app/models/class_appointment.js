module.exports = (
  RailsResource,
  railsSerializer
) => {
  'ngInject';

  class ClassAppointment extends RailsResource {}

  ClassAppointment.configure({
    url:  'http://localhost:3000/v1/class_appointments',
    name: 'class_appointment',
    serializer: railsSerializer(function() {
      this.serializeWith('startsAt', 'DateSerializer');
      this.serializeWith('endsAt', 'DateSerializer');
      this.nestedAttribute('attachments');
    })
  });

  return ClassAppointment;
};
