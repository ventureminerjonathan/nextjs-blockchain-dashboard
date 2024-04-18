/**
 * client.js - a bitcoin client for accessing our node daemon.
 * https://github.com/ventureminerjonathan/nextjs-blockchain-dashboard
 * Copyright (c) 2024, Jonathan Gonzales
 */

'use strict';

const assert = require('bsert');
const Network = require('bcoin/lib/protocol/network');
const {NodeClient} = require('bclient');
const network = Network.get('regtest');


class Client extends NodeClient {
  constructor(options) {
    super();
    this.options = new ClientOptions(options);
    this.port = this.options.port;
    this.headers = this.options.headers;
    this.host = this.options.host;
  }

  /**
   * Get node blockchain info.
   * @returns {Promise}
   */

  getBlockchainInfo() {
    return this.execute('getblockchaininfo', [])
  }
}

class ClientOptions {
  constructor(options) {
    this.network = network;
    this.port = network.rpcPort;
    this.headers = {'Content-Type': 'application/json'};
    this.host = 'localhost';

    if (options)
      this.fromOptions(options);
  }

  fromOptions(options) {
    assert(options);
    this.network = options.network;
    this.port = options.port;
    this.headers = options.headers;
    this.host = options.host;

    if (options.network != null) {
      assert(typeof options.network === 'object');
      this.network = options.network;
    }

    if (options.port != null) {
      assert(typeof options.port === 'number');
      this.port = options.port;
    }

    if (options.host != null) {
      assert(typeof options.host === 'string');
      this.host = options.host;
    }

    return this;
  }

  static fromOptions(options) {
    return new ClientOptions().fromOptions(options);
  }
}

/*
 * Helpers
 */

function format(block) {
  let coinbase = this.getTX(block.tx[0].txid);

  block.minedBy = coinbase.outputs[0].address;
  block.totalTXS = block.tx.length;
  block.fees = null;
  block.reward = null;
  return block;
}

module.exports = Client;
