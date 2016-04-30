export function makeId(length = 8) {
  let id = ''
  const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    id += charSet.charAt(Math.floor(Math.random() * charSet.length))
  }
  return id
}

export function isLineSelected(line, bbox) {
  const lx1 = Number(line.attr('x1'))
  const ly1 = Number(line.attr('y1'))
  const lx2 = Number(line.attr('x2'))
  const ly2 = Number(line.attr('y2'))
  const bx1 = Number(bbox.x)
  const by1 = Number(bbox.y)
  const bx2 = Number(bbox.x2)
  const by2 = Number(bbox.y2)

  if (lx1 >= bx1 && lx1 <= bx2 && ly1 >= by1 && ly1 <= by2) {
    return true
  }
  if (lx2 >= bx1 && lx2 <= bx2 && ly2 >= by1 && ly2 <= by2) {
    return true
  }

  if (lx1 === lx2) {
    return (lx1 >= bx1 && lx1 <= bx2 && ly1 <= by1 && ly2 >= by2)
  }

  if (ly1 === ly2) {
    return (lx1 <= bx1 && lx2 >= bx2 && ly1 >= by1 && ly2 <= by2)
  }

  const k = (ly1 - ly2) / (lx1 - lx2)
  const d = (lx1 * ly2 - lx2 * ly1) / (lx1 - lx2)
  let x = 0
  let y = 0

  x = (by1 - d) / k
  y = by1
  if (x >= lx1 && x <= lx2 && y >= ly1 && y <= ly2) {
    return true
  }

  x = bx1
  y = k * bx1 + d
  if (x >= lx1 && x <= lx2 && y >= ly1 && y <= ly2) {
    return true
  }

  x = (by2 - d) / k
  y = by2
  if (x >= lx1 && x <= lx2 && y >= ly1 && y <= ly2) {
    return true
  }

  x = bx2
  y = k * bx2 + d
  if (x >= lx1 && x <= lx2 && y >= ly1 && y <= ly2) {
    return true
  }

  return false
}
