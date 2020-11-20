const { mongoose } = require('../lib/mongoose')

const BoardSchema = new mongoose.Schema(
  {
    deleted: {
      type: Date
    },
    name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    text: {
      type: String,
      default: ''
    },
    columns: [
      {
        title: String
      }
    ],
    sections: [
      {
        id: String,
        name: String,
        text: String,
        backgroundColor: String,
        cards: [[String]],
        deleted: Date
      }
    ],
    members: [String]
  },
  {
    collection: 'board',
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated'
    },
    // No virtual id property, disabling it prevents it showing up when converting to json
    id: false
  }
)

module.exports = mongoose.model('Board', BoardSchema)
