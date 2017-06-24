module.exports = {
  templateUrl: '/components/virtual_classroom/template.html',

  bindings: {
    appointment:        '<',
    whiteboardReadonly: '<'
  },

  controller: class {
    isSidenavOpen = true;
    webRTC        = new SimpleWebRTC({});
    chat          = {messages: []};

    constructor($q, $scope, $timeout) {
      'ngInject';

      this.$q       = $q;
      this.$scope   = $scope;
      this.$timeout = $timeout;
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

    transmitWhiteboardSignal(functionName, args) {
      const payload = {functionName, args};
      this.webRTC.sendDirectlyToAll(undefined, 'whiteboardSignal', payload);
    }

    // Sidenav controls
    closeSidenav() {
      this.isSidenavOpen = false;
      this.whiteboardCtrl.resize(1000);
    }

    openSidenav() {
      this.isSidenavOpen = true;
      this.unreadMessages = false;
      this.whiteboardCtrl.resize(1000);
    }

    // Handlers
    onChatMessage(message) {
      this.chat.messages.push(message)
      if (!this.isSidenavOpen) this.unreadMessages = true;
    }

    onWhiteboardSignal(signal) { this.whiteboardCtrl.consumeSignal(signal); }
  }
};
