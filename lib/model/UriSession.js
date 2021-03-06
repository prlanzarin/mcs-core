/**
 * @classdesc
 * Model class for external devices
 */

'use strict'

const C = require('../constants/Constants');
const uuidv4 = require('uuid/v4');
const EventEmitter = require('events').EventEmitter;
const MediaServer = require('../media/media-server');

module.exports = class UriSession extends EventEmitter {
  constructor(uri = null) {
    super();
    this.id = uuidv4();
    this._status = C.STATUS.STOPPED;
    this._uri;
    if (uri) {
      this.setUri(uri);
    }
  }

  setUri (uri) {
    this._uri = uri;
  }

  async start () {
    this._status = C.STATUS.STARTING;
    try {
      const mediaElement = await MediaServer.createMediaElement(this.id, C.MEDIA_TYPE.URI);
      console.log("start/cme");
      await MediaServer.play(this.id);
      this._status = C.STATUS.STARTED;
      return Promise.resolve();
    }
    catch (err) {
      this.handleError(err);
      return Promise.reject(new Error(err));
    }
  }

  // TODO move to parent Session
  async stop () {
    this._status = C.STATUS.STOPPING;
    try {
      await MediaServer.stop(this.id);
      this._status = C.STATUS.STOPPED;
      return Promise.resolve();
    }
    catch (err) {
      this.handleError(err);
      return Promise.reject(new Error(err));
    }
  }

  // TODO move to parent Session
  async connect (sinkId) {
    try {
      await MediaServer.connect(this.id, sinkId);
      return Promise.resolve()
    }
    catch (err) {
      this.handleError(err);
      return Promise.reject(new Error(err));
    }
  }

  handleError (err) {
    console.log(err);
    this._status = C.STATUS.STOPPED;
  }
}
