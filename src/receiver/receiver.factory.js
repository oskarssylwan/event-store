const { createReceiver } = require('./receiver')
const express = require('express')

module.exports = { createReceiver: createReceiver(express) }
