#!/usr/bin/env node
'use strict'

var assert = require('assert')
var getRandomBytes = require('crypto').randomBytes

var bindings = require('../bindings')
var purejs = require('../js')
var util = require('./util')
global.it = function (_, fn) { fn() } // make util.repeatIt useful

var STEP_REPEAT = 100000

var repeat = util.env.repeat
var seed = util.env.seed
while (repeat > 0) {
  util.setSeed(seed)
  util.repeatIt('random tests', (repeat % STEP_REPEAT) || STEP_REPEAT, function () {
    var message = util.getMessage()
    var privateKey = util.getPrivateKey()
    var publicKey = bindings.publicKeyCreate(privateKey)
    var expected = bindings.sign(message, privateKey)

    var sigObj = purejs.sign(message, privateKey)
    assert.equal(sigObj.signature.toString('hex'), expected.signature.toString('hex'))
    assert.equal(sigObj.recovery, expected.recovery)

    var isValid = purejs.verify(message, sigObj.signature, publicKey)
    assert.equal(isValid, true)

    var publicKey2 = purejs.recover(message, sigObj.signature, sigObj.recovery, true)
    assert.equal(publicKey2.toString('hex'), publicKey.toString('hex'))
  })

  repeat -= STEP_REPEAT
  seed = getRandomBytes(32)
}
