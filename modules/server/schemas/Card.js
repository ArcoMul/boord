const { mongoose } = require('../lib/mongoose')

const CardSchema = new mongoose.Schema(
  {
    boardId: {
      type: mongoose.Types.ObjectId,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    text: {
      type: String
    },
    points: {
      type: Number
    },
    members: {
      type: [String],
      default: []
    },
    labels: [mongoose.Types.ObjectId]
  },
  {
    collection: 'card',
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated'
    },
    // No virtual id property, disabling it prevents it showing up when converting to json
    id: false
  }
)

module.exports = mongoose.model('Card', CardSchema)
