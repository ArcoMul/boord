const mongoose = require('mongoose')
const uuidv4 = require('uuid/v4')
const slug = require('slug')
const Board = require('../schemas/Board')
const User = require('../schemas/User')
const Card = require('../schemas/Card')

async function create({ name, userId }) {
  const boardSlug = slug(name, { lower: true })
  const other = await getBoardBySlug(boardSlug)
  if (other) {
    throw new Error('slug taken')
  }
  const board = new Board({
    name: name,
    slug: boardSlug,
    members: [userId],
    columns: [
      { title: 'Backlog' },
      { title: 'Todo' },
      { title: 'Doing' },
      { title: 'Done' }
    ],
    sections: [
      {
        id: uuidv4(),
        name: 'First section',
        backgroundColor: '#f00',
        cards: [[], [], [], []]
      }
    ],
    labels: [
      { color: '#61bd4f', name: '' },
      { color: '#f2d600', name: '' },
      { color: '#ff9f1a', name: '' },
      { color: '#eb5a46', name: '' },
      { color: '#c377e0', name: '' },
      { color: '#0079bf', name: '' }
    ]
  })
  await board.save()
  return board
}

async function remove({ boardId }) {
  await updateBoard({ board: { _id: boardId, deleted: new Date() } })
}

async function getBoardBySlug(slug) {
  const board = await Board.findOne({ slug }).lean()
  return board
}

async function updateSection({ boardId, section }) {
  const board = await Board.findById(boardId)
  const index = board.sections.findIndex(s => s.id === section.id)
  return Board.findByIdAndUpdate(
    new mongoose.Types.ObjectId(boardId),
    { $set: { [`sections.${index}`]: section } },
    { new: true }
  )
}

async function addSection({ boardId, section: { name } }) {
  const _board = await Board.findById(boardId).lean()
  const section = {
    id: uuidv4(),
    name: name,
    cards: new Array(_board.columns.length).fill([])
  }
  const board = await Board.findByIdAndUpdate(
    { _id: new mongoose.Types.ObjectId(boardId) },
    { $push: { sections: section } },
    { new: true }
  )
  return board
}

/**
 * A bit of a dangerous function, as it allows overwritting the whole board data
 * therefore only allow one property to be updated per function call.
 * Function should maybe get depricated
 */
function updateBoard({ board }) {
  if (!board._id) {
    throw new Error(
      "Object submitted to updateBoard doesn't contain a _id property"
    )
  }
  if (Object.keys(board).length > 2) {
    throw new Error(
      'Object submitted to updateBoard with too many properties: ' +
        Object.keys(board)
    )
  }
  return Board.findByIdAndUpdate(
    new mongoose.Types.ObjectId(board._id),
    { $set: board },
    { new: true }
  )
}

async function addCard({ boardId, sectionId, cardId }) {
  const board = await Board.findById(boardId)
  const index = board.sections.findIndex(s => s.id === sectionId)
  return Board.findByIdAndUpdate(
    new mongoose.Types.ObjectId(boardId),
    { $push: { [`sections.${index}.cards.0`]: cardId } },
    { new: true }
  )
}

/**
 * Move a card in a column, or from one column to another column, or from on
 * section to another section.
 *
 * Could cause race conditions since the two calls to move the card are not
 * atomic. So before scaling up or having too many users something smarter
 * should be thought up.
 */
async function moveCard({
  boardId,
  sectionId,
  columnIndex,
  removedIndex,
  addedIndex,
  cardId
}) {
  const board = await Board.findById(boardId)
  const sectionIndex = board.sections.findIndex(s => s.id === sectionId)
  if (addedIndex != null && removedIndex != null) {
    await Board.updateOne(
      { _id: new mongoose.Types.ObjectId(boardId) },
      {
        $pull: { [`sections.${sectionIndex}.cards.${columnIndex}`]: cardId }
      }
    )
    return Board.findByIdAndUpdate(
      new mongoose.Types.ObjectId(boardId),
      {
        $push: {
          [`sections.${sectionIndex}.cards.${columnIndex}`]: {
            $each: [cardId],
            $position: addedIndex
          }
        }
      },
      { new: true }
    )
  } else if (addedIndex == null) {
    return Board.findByIdAndUpdate(
      new mongoose.Types.ObjectId(boardId),
      {
        $pull: { [`sections.${sectionIndex}.cards.${columnIndex}`]: cardId }
      },
      { new: true }
    )
  } else if (removedIndex == null) {
    return Board.findByIdAndUpdate(
      new mongoose.Types.ObjectId(boardId),
      {
        $push: {
          [`sections.${sectionIndex}.cards.${columnIndex}`]: {
            $each: [cardId],
            $position: addedIndex
          }
        }
      },
      { new: true }
    )
  }
}

async function removeSection({ boardId, sectionId }) {
  const board = await Board.findById(boardId)
  const sectionIndex = board.sections.findIndex(
    section => section.id === sectionId
  )
  return Board.findByIdAndUpdate(
    new mongoose.Types.ObjectId(boardId),
    { $set: { [`sections.${sectionIndex}.deleted`]: new Date() } },
    { new: true }
  )
}

async function removeCard({ boardId, cardId }) {
  const board = await Board.findById(boardId)
  const sectionIndex = board.sections.findIndex(
    section => section.cards.filter(cards => cards.includes(cardId)).length > 0
  )
  const cardsIndex = board.sections[sectionIndex].cards.findIndex(cards =>
    cards.includes(cardId)
  )
  return Board.findByIdAndUpdate(
    new mongoose.Types.ObjectId(boardId),
    { $pull: { [`sections.${sectionIndex}.cards.${cardsIndex}`]: cardId } },
    { new: true }
  )
}

async function addMemberByEmail(boardId, email) {
  const user = await User.findOne({ email })
  return Board.findByIdAndUpdate(
    new mongoose.Types.ObjectId(boardId),
    { $push: { members: user._id } },
    { new: true }
  )
}

function removeMember(boardId, userId) {
  return Board.findByIdAndUpdate(
    new mongoose.Types.ObjectId(boardId),
    { $pull: { members: userId } },
    { new: true }
  )
}

async function getMembers(board) {
  const cards = await Card.find({
    boardId: new mongoose.Types.ObjectId(board._id)
  })
  const cardMembers = cards.reduce((acc, card) => {
    if (card.members) {
      card.members.forEach(id => acc.add(id))
    }
    return acc
  }, new Set())
  return User.find({
    _id: { $in: [...(board.members || []), ...Array.from(cardMembers)] }
  }).lean()
}

module.exports = {
  create,
  remove,
  getBoardBySlug,
  updateSection,
  addSection,
  updateBoard,
  addCard,
  moveCard,
  removeSection,
  removeCard,
  addMemberByEmail,
  removeMember,
  getMembers
}
