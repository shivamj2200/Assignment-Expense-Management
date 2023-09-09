const { Schema, mongoose } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const userExpense = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
userExpense.plugin(mongoosePaginate);

module.exports = mongoose.model('Record', userExpense);
