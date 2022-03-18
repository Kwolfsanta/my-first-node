const { login } = require('../controller/user')
const { set } = require('../db/redis')
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 获取Cookie的过期时间
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
  return d.toGMTString()
}

const handleUserRouter = (req, res) => {
  const method = req.method
  if (method === 'GET' && req.path === '/api/user/login') {
    // POST请求使用postData
    // const { username, password } = req.body

    // 暂时模拟浏览器发送请求（不用Postman
    const { username, password } = req.query
    const result = login(username, password)
    return result.then(resp => {
      if (resp.username) {
        if (req.needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${req.sessionId}; path=/; httpOnly; expires=${getCookieExpires()};`)
        }
        // 设置session
        req.session.username = resp.username
        req.session.realname = resp.realname
        set(req.sessionId, req.session) // 给该userid添加数据到redis
        console.log('req.session is: ', req.session);
        return new SuccessModel('登录成功')
      } else {
        return new ErrorModel(resp || '登录失败')
      }
    })
  }

  if (method === 'GET' && req.path === '/api/user/login-test') {
    if (req.session.username) {
      return Promise.resolve(new SuccessModel({
        session: req.session
      }))
    }
    return Promise.resolve(new ErrorModel('尚未登录！'))
  }
}

module.exports = handleUserRouter