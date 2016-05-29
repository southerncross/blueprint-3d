import configs from '../configs'

function getDownloadUrlAPI(req, res) {
  const { key } = req.params
  if (!key) {
    res.status(403).json({ message: '参数不足' })
  }
  res.status(200).json({ url: `http://${configs.qiniu.domain}/${key}` })
}

export default {
  getDownloadUrlAPI
}
