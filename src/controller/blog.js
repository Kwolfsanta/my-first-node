const { exec } = require('../db/mysql')

const getList = (author, keyword) => {
  let sql = `select * from blogs where 1=1`
  if (author) {
    sql += ` and author='${author}'`
  }
  if (keyword) {
    sql += ` and title like '%${keyword}%'`
  }
  sql += ' order by create_time desc'
  return exec(sql)
  // 先返回假数据，格式是正确的
  // let fakeData = []
  // for (let i = 0; i < 5; i++) {
  //   const obj = {
  //     id: i,
  //     title: '标题' + i,
  //     content: `内容${i} - ${Math.floor(Math.random() * 100000000)}`,
  //     createTime: +new Date(),
  //     author: 'Author' + i
  //   }
  //   fakeData.push(obj)
  // }
  // return fakeData
}

const getDetail = (id) => {
  if (!id) {
    const sql = `select * from blogs limit 10;`
    return exec(sql)
  }
  const sql = `select * from blogs where id =${id};`
  return exec(sql).then(rows => {
    return rows[0]
  })
}

const newBlog = (blogData = {}) => {
  // blogData是一个博客对象，包含title，content属性
  // return {
  //   id: 3 //表示新建博客，插入到表里的id
  // }
  const { title, author, content } = blogData
  const create_time = +new Date()
  const sql = `insert into blogs (title, content, create_time, author) values ('${title}', '${content}', ${create_time}, '${author}');`
  return exec(sql).then(insertData => {
    console.log('insertData: ', insertData);
    return {
      id: insertData.insertId
    }
  })
}

const updateBlog = (id, blogData = {}) => {
  if (!id) {
    return 'id有问题'
  }
  const { title, content } = blogData
  const sql = `
    update blogs set title='${title}', content='${content}' where id=${id};
  `
  return exec(sql).then(updateData => {
    console.log('updateData: ', updateData);
    if (updateData.affectedRows > 0) {
      return true
    }
    return false
  })
}

const delBlog = (id, author = 'zhangsan') => {
  if (!id) {
    return 'id有问题'
  }
  const sql = `
    delete from blogs where id=${id} and author='${author}';
  `
  return exec(sql).then(delData => {
    if (delData.affectedRows > 0) {
      return true
    } else {
      return false
    }
  })
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}