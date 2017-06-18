module.exports = {
  templateUrl: '/components/virtual_classroom/template.html',

  bindings: {
    appointment: '<'
  },

  controller: class {
    constructor($element) {
      'ngInject';

      this.$video = $element.find('video')[0];
    }

    $onInit() {
      this.roomName = `appointment-${this.appointment.id}`;

      this.webRTC =
        new SimpleWebRTC({
          localVideo:       this.$localVideo,
          remoteVideos:     this.$remoteVideos,
          autoRequestMedia: true,
          debug:            true
        });

      this.webRTC.on('createdPeer', _ => alert('CREATED PEER'));

      this.webRTC.on('videoAdded', (_, peer) => {
        alert('VIDEO ADDED');
        this.displayRemoteStream(peer.stream);
      });
    }

    createRoom() {
      console.log('ATTEMPTING ROOM CREATION');

      this.webRTC.createRoom(this.roomName, err => {
        if (err) console.log('ERROR CREATING ROOM', err);
        else {
          console.log('SUCCESS CREATING ROOM');
          delete this.roomName;
        }
      });
    }

    joinRoom(name) {
      console.log('ATTEMPTING ROOM JOIN');

      this.webRTC.joinRoom(this.roomToJoin, err => {
        if (err) console.log('ERROR JOINING ROOM', err);
        else {
          console.log('SUCCESS JOINING ROOM');
          delete this.roomToJoin
        }
      })
    }

    displayRemoteStream(s) { this.$video.srcObject = s; }
  }
};
