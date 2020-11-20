const { mongoose } = require('../lib/mongoose')

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    password: {
      type: String
    },
    avatar: String,
    slackId: String,
    permissions: [String]
  },
  {
    collection: 'user',
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated'
    },
    // No virtual id property, disabling it prevents it showing up when converting to json
    id: false
  }
)

module.exports = mongoose.model('User', UserSchema)
