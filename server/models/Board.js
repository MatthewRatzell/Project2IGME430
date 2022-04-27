const mongoose = require('mongoose');
const _ = require('underscore');

let BoardModel = {};

const setTitle = (title) => _.escape(title).trim();

const BoardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setTitle,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },

});

BoardSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  _id: doc._id,
});

BoardSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    // convert the string ownerId to an object id
    owner: mongoose.Types.ObjectId(ownerId),
  };
  return BoardModel.find(search).select(' title').lean().exec(callback);
};

BoardModel = mongoose.model('Board', BoardSchema);

module.exports = BoardModel;
