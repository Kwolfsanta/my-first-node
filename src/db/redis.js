const redis = require('redis')
const { REDIS_CONF } = require('../conf/db')

const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)

redisClient.on('error', err => {
  console.error(err)
})

function set(key, val) {
  // 注意，如果val是个对象，需要转成字符串
  if (typeof val === 'object') {
    val = JSON.stringify(val)
  }
  redisClient.set(key, val, redis.print)
}

function get(key) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err ,val) => {
      if (err) {
        reject('Redis get error: ', err)
        return
      }
      // 注意，这里不能简单地直接resolve(val)
      if (val == null) {
        resolve(null) // 如果值是null，应该直接resolve
        return
      }
      try { // 如果值不是null，有可能是JSON形式的字符串，我们应当先转一下
        resolve(
          JSON.parse(val)
        )
      } catch(ex) { // 当转JSON格式失败，我们可以直接resolve
        resolve(val)
      }
    })
  })
}

module.exports = {
  set,
  get
}