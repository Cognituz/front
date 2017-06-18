module.exports = {
  templateUrl: '/components/virtual_classroom/template.html',

  bindings: {
    appointment:        '<',
    whiteboardReadonly: '<'
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

    chat = {messages: []};

    $onInit() {
      this.roomName = `appointment-${this.appointment.id}`;

      // Ensure room exists
      this.joinRoom();

      this.webRTC.on('videoAdded', (_, peer) => {
        this.remoteStream = peer.stream;
        this.$scope.$apply();
      });

      this.webRTC.on('channelMessage', (peer, channelLabel, data) =>  {
        if (data.type === 'chatMessage')
          this.chat.messages.push(data.payload) && this.$scope.$apply();

        if (data.type === 'whiteboardSignal') {
          console.log('GOT SIGNAL');

          this.whiteboardCtrl.consumeSignal({
            functionName: data.payload.functionName,
            args:         data.payload.args
          });
        }
      });
    }

    joinRoom(roomName = this.roomName) {
      this.doJoinRoom(roomName).then(_ => this.roomJoined = true);
    }

    doJoinRoom(roomName = this.roomName) {
      return this.$q((f,r) => this.webRTC.joinRoom(roomName, e => e ? r(e) : f()));
    }

    submitChatMessage() {
      this.webRTC.sendDirectlyToAll(undefined, 'chatMessage', this.chatMessage);
      this.chat.messages.push(this.chatMessage);
      delete this.chatMessage;
    }

    transmitWhiteboardSignal(functionName, args) {
      const payload = {functionName, args};
      this.webRTC.sendDirectlyToAll(undefined, 'whiteboardSignal', payload);
    }
  }
};
