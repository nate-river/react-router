const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit: 10000,
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'node-news'
});
function query(sql, arr, fn) {
  pool.getConnection((err, con)=> {
    con.query(sql, arr, (err, res)=> {
      con.release();
      fn(err, res);
    })
  })
}
module.exports = {
  query: query
};
