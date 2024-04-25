// mysql 모듈 소환
const mariadb = require("mysql2");

// const mariadb = require("mysql2/promise");
// mysql에 promise를 자동으로 query를 감쌈
// query문 자체를 promise 객체로 만듦

// DB의 연결 통로 생성
const connection = mariadb.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "Bookshop",
  dateStrings: true,
});

// const connection = async () => {
//   const conn = await mariadb.createConnection({
//     // mariadb연결이 promise객체가 되어 await을 붙여줌
//     host: "localhost",
//     user: "root",
//     password: "root",
//     database: "Bookshop",
//     dateStrings: true,
//   });

//   return conn;
//   // async 함수안에 있는 값을 보내주기 위해서 return을 사용
//   // 안에있는 conn값을 module.exports로 직접 전할 수 없기 때문
// };

module.exports = connection;
