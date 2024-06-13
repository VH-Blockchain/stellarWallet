const mongoose = require('mongoose');

const modalSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  publicKey: {
    type: String,
    required: true
  },
  secreteKey: {
    type: String,
    required: true
  }
}); 

const Modal = mongoose.model('Modal', modalSchema);

module.exports = Modal;