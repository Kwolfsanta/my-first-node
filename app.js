const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const SESSION_DATA = {}

const serverHandler = (req, res) => {
  res.setHeader('Content-type', 'application/json')
  // 获取url
  const path = req.url.split('?')[0]
  req.path = path

  // 解析query
  const query1 = querystring.parse(req.url.split('?')[1])
  const query2 = new URLSearchParams(req.url.split('?')[1])

  // 解析cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if (!item) {
      return
    }
    const arr = item.split('=')
    const key = arr[0].trim()
    const val = arr[1].trim()
    req.cookie[key] = val
  });
  console.log('req.cookie is', req.cookie);

  // 解析session
  let needSetCookie = false
  let userId = req.cookie.userId
  if (userId) {
    if (!SESSION_DATA[userId]) {
      SESSION_DATA[userId] = {}
    }
    req.session = SESSION_DATA[userId]
  } else {
    needSetCookie = true
    userId = `${Date.now() + Math.floor(Math.random() * 10000)}`
    SESSION_DATA[userId] = {}
  }
  req.session = SESSION_DATA[userId]
  req.needSetCookie = needSetCookie
  req.userId = userId
  req.query = query1
  getPostData(req).then(postData => {
        // handleBlogRouter(req, res).then(blogData => {
    //   if (blogData) {
    //     console.log(blogData);
    //     res.end(
    //       JSON.stringify(blogData)
    //     )
    //     return
    //   }
    // }).catch(err => {
    //   console.error(err);
    // })
    req.body = postData
    const blogRes = handleBlogRouter(req, res)
    if (blogRes) {
      blogRes.then(blogData => {
        res.end(
          JSON.stringify(blogData)
        )
      })
      return
    }
  
    // 未命中博客路由，处理用户路由
    const userData = handleUserRouter(req, res)
    if (userData) {
      userData.then(userData => {
        res.end(
          JSON.stringify(userData)
        )
      })
      return
    }

    // 未命中路由，需要返回404
    const resData = {
      msg: '404, 这里是没有知识的荒原'
    }
    res.writeHead(404, {'Content-type': 'application/json'})
    // res.write('404 Not Found\n')
    res.end(
      JSON.stringify(resData.msg)
    )
  })

  // const resData = {
  //   name: 'Kwolf',
  //   age: 25000
  // }
  // res.end(
  //   JSON.stringify(resData)
  // )
}

// 用于处理post data
function getPostData(req) {
  return new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({})
      return
    }
    if (req.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }
    let postData = ''
    req.on('data', chunk => {
      postData += chunk
    })
    req.on('end', () => {
      console.log('postData:', postData);
      if (!postData) {
        resolve({})
        return
      } else {
        resolve(JSON.parse(postData))
      }
    })
  })
}

module.exports = serverHandler