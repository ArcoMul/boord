const Card = require('../schemas/Card')

async function create({ boardId, title, text, points }) {
  const card = new Card({
    boardId,
    title,
    text: text || '',
    points: points || 0
  })
  await card.save()
  return card
}

module.exports = {
  create
}
