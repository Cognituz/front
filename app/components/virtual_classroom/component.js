import Peer from 'peerjs-client';
import {PEERJS_HOST, PEERJS_PORT} from 'config';

module.exports = {
  templateUrl: '/components/virtual_classroom/template.html',
  bindings: {
    appointment: '<'
  },
  controller: class {
    constructor($element, $q, Auth) {
      'ngInject';
      this.video = $element.find('video')[0];

      // Inject services for use in instance methods
      this.Auth = Auth;
      this.$q = $q;
    }

    log = []

    getUserMedia =
      (
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia
      )
        .bind(navigator);

    $onInit() {
      this.Auth.getCurrentUser().then(currentUser => {
        this.selfPeerId      = currentUser.id;
        this.recipientPeerId = this.appointment.teacherId;

        this.peer =
          new Peer(this.selfPeerId, {
            host:  PEERJS_HOST,
            port:  PEERJS_PORT,
            debug: 3
          });

        this.peer.on('call', call => {
          this.log.push('Received call');
          this.call = call;
          this.getStream().then(s => call.answer(s))
          call.on('stream', s => this.displayStream(s))
        });
      });
    }

    $onDestroy() {
      this.stopStream();
      this.call.close();
      this.peer.destroy();
    }

    performCall() {
      this.getStream().then(stream => {
        this.call = this.peer.call(this.recipientPeerId, stream);
        this.call.on('stream', s => this.displayStream(s))
      });
    }

    getStream() {
      const opts = { video: true, audio: true };

      if (this.stream)
        return this.$q.resolve(this.stream);
      else
        return this.$q((fulfill, reject) =>
          this.getUserMedia(opts,
            stream => {
              this.stream = stream;
              fulfill(stream);
            },

            reject
          )
        );
    }

    stopStream() {
      if (!this.stream) return;
      this.stream.getAudioTracks().forEach(t => t.stop());
      this.stream.getVideoTracks().forEach(t => t.stop());
    }

    displayStream(stream) { this.video.srcObject = stream; }
  }
};
