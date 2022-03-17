const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const handleBlogRouter = (req, res) => {
  const method = req.method
  const id = req.query.id
  // 获取博客列表的接口
  if (method === 'GET' && req.path === '/api/blog/list') {
    const author = req.query.author || ''
    const keyword = req.query.keyword || ''
    return getList(author, keyword).then(res => {
      if (res) {
        return new SuccessModel(res)
      }
    })
  }
  // 获取博客详情的接口
  if (method === 'GET' && req.path === '/api/blog/detail') {
    return getDetail(id).then(detailData => {
      return new SuccessModel(detailData)
    })
  }
  // 新建博客的接口
  if (method === 'POST' && req.path === '/api/blog/new') {
    return newBlog(req.body).then(insertData => {
      return new SuccessModel(insertData)
    })
  }
  // 更新博客的接口
  if (method === 'POST' && req.path === '/api/blog/update') {
    // const result = updateBlog(id, req.body)
      // return result.then(res => {
      //   return new SuccessModel(res)
      // }).catch(err => {
      //   return new ErrorModel(err)
      // })
    return updateBlog(id, req.body).then(res => {
      return new SuccessModel(res)
    })
  }
  // 删除博客的接口
  if (method === 'POST' && req.path === '/api/blog/del') {
    return delBlog(id).then(res => {
      if (res) {
        return new SuccessModel(res)
      } else {
        return new ErrorModel(res)
      }
    })
  }
}

module.exports = handleBlogRouter