module.exports = {
  templateUrl: '/components/virtual_classroom/template.html',

  bindings: {
    appointment: '='
  },

  controller: class {
    constructor($element, $q, $scope) {
      'ngInject';

      this.$q     = $q;
      this.$scope = $scope;
    }

    webRTC = new SimpleWebRTC({
      autoRequestMedia: true,
      debug:            true
    });

    $onInit() {
      this.roomName = `appointment-${this.appointment.id}`;

      // Ensure room exists
      this.joinRoom();

      this.webRTC.on('createdPeer', peer => {
        if (peer.stream) {
          this.remoteStream = peer.stream;
          this.$scope.$apply();
        }
      });

      this.webRTC.on('videoAdded', (_, peer) => {
        this.remoteStream = peer.stream;
        this.$scope.$apply();
      });
    }

    createRoom(roomName = this.roomName) {
      this.doCreateRoom(roomName).then(_ => this.roomCreated = true);
    }

    joinRoom(roomName = this.roomName) {
      this.doJoinRoom(roomName).then(_ => this.roomJoined = true);
    }

    // This method is idempotent, if room was already created won't complain
    doCreateRoom(roomName = this.roomName) {
      return this.$q((f,r) => this.webRTC.createRoom(roomName, e => e ? r(e) : f()));
    }

    doJoinRoom(roomName = this.roomName) {
      return this.$q((f,r) => this.webRTC.joinRoom(roomName, e => e ? r(e) : f()));
    }
  }
};
