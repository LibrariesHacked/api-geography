const mcache = require('memory-cache')

/**
 * Caches the incoming request by URL for a specified duration
 * @param {*} duration Cache duration in seconds
 * @returns
 */
const cache = duration => {
  return (req, res, next) => {
    const key = '__express__' + req.originalUrl || req.url
    const cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
    } else {
      res.sendResponse = res.send
      res.send = body => {
        mcache.put(key, body, duration * 1000)
        res.sendResponse(body)
      }
      next()
    }
  }
}

module.exports = cache
