module.exports = {
  templateUrl: '/components/teacher/profile/addresses/form/template.html',
  bindings: {afterSave: '&?'},
  controller: class {
    constructor(
      $mdToast,
      Auth,
      User,
      lockingScope,
      $stateParams,
      Location,
      $state
    ) {
      'ngInject';
      this.$mdToast     = $mdToast;
      this.$stateParams = $stateParams;
      this.Auth         = Auth
      this.lockingScope = lockingScope;
      this.Location     = Location;
      this.$state       = $state;

      Auth
        .getCurrentUser()
        .then(user => {
          this.user = angular.copy(user)
          if(this.$stateParams.id) {
            this.Location.get(this.$stateParams.id).then(location => this.location = location )
          }
          else {
            this.location = new this.Location();
          }
        });

      this.input = document.getElementById('searchInput');
      var autocomplete = new google.maps.places.Autocomplete(this.input);
    }

    save() {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': this.input.value}, (results, status) => {
        if (status == 'OK') {
          this.location.latitude = results[0].geometry.location.lat();
          this.location.longitude = results[0].geometry.location.lng();
          this.location.userId = this.user.id;

          this.lockingScope(this, _ =>
            this.location
              .save()
              .then(location => this.showSuccessMessage())
              .catch(resp => this.handleError(resp))
          );
        } else {
          console.log('Geocode was not successful for the following reason: ' + status);
        }
      });
    }

    showSuccessMessage() {
      this.$mdToast.showSimple('Se agrego la dirección exitosamente');
      this.$state.go('app.s.teachers.profile.addresses')
    }

    handleError(resp) {
      const msg =
        resp.status == 422 ?
        `Operación inválida: ${resp.data.errors}` :
        'Halgo ha salido mal. Por favor intentálo mas tarde'

      this.$mdToast.showSimple(msg);

      throw(resp);
    }
  }
};
