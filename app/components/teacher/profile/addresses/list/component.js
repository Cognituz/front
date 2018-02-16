module.exports = {
  templateUrl: '/components/teacher/profile/addresses/list/template.html',
  bindings: {afterSave: '&?'},
  controller: class {
    constructor($mdToast, Auth, User, lockingScope, Location) {
      'ngInject';
      this.$mdToast     = $mdToast;
      this.Auth         = Auth
      this.lockingScope = lockingScope;
      this.Location     = Location;

      Auth
        .getCurrentUser()
        .then(user => {
          this.user = angular.copy(user);
          this.initMap();
        });
    }

    initMap() {
      var LatLng = {
        lat: parseFloat(this.user.locations[0].latitude),
        lng: parseFloat(this.user.locations[0].longitude)
      };

      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: LatLng
      });

      this.user.locations.forEach(function(location) {
        var LatLng = {
          lat: parseFloat(location.latitude),
          lng: parseFloat(location.longitude)
        };

        var marker = new google.maps.Marker({
          position: LatLng,
          map: map,
          title: location.name
        });
      });
    }

    getAddress(id, index) {
      this.Location.get(id).then(location => this.destroyAddress(location, index) )
    }

    destroyAddress(location, index) {
      this.location = location;
      this.location.delete = true;
      this.lockingScope(this, _ =>
        this.location
          .save()
          .then(location => this.showSuccessMessage(index))
          .catch(resp => this.handleError(resp))
      );
    }

    showSuccessMessage(index) {
      this.user.locations.splice(index)
      this.$mdToast.showSimple('Se borro la dirección exitosamente');
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
