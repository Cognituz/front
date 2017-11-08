module.exports = {
  templateUrl: '/components/teacher/profile/addresses/list/template.html',
  bindings: {afterSave: '&?'},
  controller: class {
    constructor($mdToast, Auth, User, lockingScope) {
      'ngInject';
      this.$mdToast     = $mdToast;
      this.Auth         = Auth
      this.lockingScope = lockingScope;

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
    };
  }

};
