const {map} = require('lodash');

module.exports = {
  templateUrl: '/components/virtual_classroom/template.html',

  bindings: {
    appointment:        '<',
    whiteboardReadonly: '<'
  },

  controller: class {
    isSidenavOpen    = true;
    webRTC           = new SimpleWebRTC({});
    chat             = {messages: []};

    constructor($q, $scope, $timeout) {
      'ngInject';

      this.$q               = $q;
      this.$scope           = $scope;
      this.$timeout         = $timeout;
    }

    $onInit() {
      this.joinRoom(`appointment-${this.appointment.id}`)
        .then(_ => this.roomJoined = true);

      this.onWebRTCEvent('videoAdded', (_, peer) => {
        this.remoteStream = peer.stream;
      });

      this.onWebRTCEvent('channelMessage', (peer, channelLabel, data) =>  {
        if (data.type === 'chatMessage') this.onChatMessage(data.payload);
        if (data.type === 'whiteboardSignal') this.onWhiteboardSignal(data.payload);
      });
    }

    onWebRTCEvent(eventName, callback) {
      return this.webRTC.on(eventName, (...args) =>
        this.$scope.$apply(_ => callback(...args))
      );
    }

    $onDestroy() {
      this.webRTC.leaveRoom();
      this.webRTC.stopLocalVideo();
      this.webRTC.disconnect();
    }

    joinRoom(roomName = this.roomName) {
      return this.$q((f,r) => this.webRTC.joinRoom(roomName, e => e ? r(e) : f()));
    }

    submitChatMessage() {
      this.webRTC.sendDirectlyToAll(undefined, 'chatMessage', this.chatMessage);
      this.chat.messages.push(this.chatMessage);
      delete this.chatMessage;
    }

    transmitWhiteboardSignal(signal) {
      this.webRTC.sendDirectlyToAll(undefined, 'whiteboardSignal', signal);
      this.persistWhiteboardSignal(signal);
    }

    // Sidenav controls
    toggleSidenav() {
      this.isSidenavOpen = !this.isSidenavOpen;
      this.setVideoChatTooltip();
      if (this.isSidenavOpen) this.unreadMessages = false;
      this.whiteboardCtrl.resize(1000);
    }

    setVideoChatTooltip() {
      if (this.isSidenavOpen)
        this.videoChatTooltip = 'Ocultar videochat';
      else {
        if (this.unreadMessages)
          this.videoChatTooltip = 'Mostrar videochat (mensajes sin leer)';
        else 
          this.videoChatTooltip = 'Mostrar videochat';
      }
    }

    // Handlers
    onChatMessage(message) {
      this.chat.messages.push(message)
      if (!this.isSidenavOpen) this.unreadMessages = true;
    }

    onWhiteboardSignal(signal) {
      this.whiteboardCtrl.consumeSignal(signal);
    }

    persistWhiteboardSignal(signal) {
      signal
      | this.buildWhiteboardSignal()
      | this.appointment.whiteboardSignals.push();

      // Throttle this process
      this.persistWhiteboardSignalPromise &&
      this.$timeout.cancel(this.persistWhiteboardSignalPromise);

      this.persistWhiteboardSignalPromise =
        this.$timeout(_ => this.appointment.save(), 5000);
    }

    buildWhiteboardSignal(signal) {
      return {
        ...signal,
        date: new Date(),
      };
    }
  }
};
