export function makeId(length = 8) {
  let id = ''
  const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    id += charSet.charAt(Math.floor(Math.random() * charSet.length))
  }
  return id
}
