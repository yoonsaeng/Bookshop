const ensureAuthorization = require("../auth"); // 인증 모듈
const jwt = require("jsonwebtoken");
// const conn = require("../mariadb"); // db 모듈
const mariadb = require("mysql2/promise"); // DB 쿼리문을 비동기 처리하기 위해 뒤에 promise 붙여줌
const { StatusCodes } = require("http-status-codes"); // status code 모듈

const order = async (req, res) => {
  let authorization = ensureAuthorization(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요.",
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "잘못된 토큰입니다.",
    });
  } else {
    // DB 쿼리문을 비동기 처리 하기 위해 db 연결 connection을 함수 안에 넣어줌
    // await은 async안에 사용할 수 있기 때문에 order함수를 async로 만들고 DB 연결을 await처리
    const conn = await mariadb.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "Bookshop",
      dateStrings: true,
    });

    const { items, delivery, totalQuantity, totalPrice, firstBookTitle } =
      req.body;

    // delivery 테이블 삽입
    let sql =
      "INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)";
    let values = [delivery.address, delivery.receiver, delivery.contact];
    let [results] = await conn.execute(sql, values); // 비동기처리 할 때 query가 아닌 execute 사용
    let delivery_id = results.insertId;

    // orders 테이블 삽입
    sql =
      "INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)";
    values = [
      firstBookTitle,
      totalQuantity,
      totalPrice,
      authorization.id,
      delivery_id,
    ];
    [results] = await conn.execute(sql, values); // 비동기처리 할 때 query가 아닌 execute 사용
    let order_id = results.insertId;

    // SELECT book_id, quantity, FROM cartItems WHERE IN (1,2,3);
    // items를 가지고, 장바구니에서 book_id, quantity 조회
    sql = "SELECT book_id, quantity FROM cartItems WHERE id IN (?)";
    let [orderItems, fields] = await conn.query(sql, [items]);
    // query를 promise로 받을 때 값을 반환하기 위해 [rows, fields]로 받아준다.
    // []안에 별칭을 바꿔서 사용 가능. 대신 순서는 rows, fields 순서

    // orderedBook 테이블 삽입
    sql = "INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?";
    // // items.. 배열 : 요소들을 하나씩 꺼내서 (foreach문 돌려서) >
    values = [];
    orderItems.forEach((item) => {
      values.push([order_id, item.book_id, item.quantity]);
    });
    // // 이중 배열, 즉 벌크로 배열을 담아서 매개변수로 넘길 때 []안에 담아서 넘긴다
    // // ex. values가 forEach를 사용하여 이중 배열로 이루어져 있다. 따라서 values를 [values]로 넘겨준다.
    [results] = await conn.query(sql, [values]);
    // 비동기처리 할 때 query가 아닌 execute 사용
    // 하지만 values가 이중 배열일 때 [values]로 사용해야 한다
    // execute가 이중 배열을 아직 처리하지 못해 execute가 아닌 query로 사용

    let result = await deleteCartItems(conn, items);

    return res.status(StatusCodes.OK).json(result);
  }
};

const deleteCartItems = async (conn, items) => {
  let sql = `DELETE FROM cartItems WHERE id IN (?)`;

  let result = await conn.query(sql, [items]);
  // WHERE IN은 execute에서는 사용 못함
  // 여러 행을 삭제하기 때문 -> 여러 행 작업할 때 [] 감싸기
  // 하나의 행을 작업할 때는 execute 가능
  return result;
};

const getOrders = async (req, res) => {
  let authorization = ensureAuthorization(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요.",
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "잘못된 토큰입니다.",
    });
  } else {
    const conn = await mariadb.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "Bookshop",
      dateStrings: true,
    });

    let sql = `SELECT orders.id, created_at, address, book_title, total_quantity, total_price, receiver, contact
  FROM orders LEFT JOIN delivery
  ON orders.delivery_id = delivery.id`;
    let [rows, fields] = await conn.query(sql);
    res.status(StatusCodes.OK).json(rows);
  }
};

const getOrderDetail = async (req, res) => {
  let authorization = ensureAuthorization(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요.",
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "잘못된 토큰입니다.",
    });
  } else {
    const orderId = req.params.id;

    const conn = await mariadb.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "Bookshop",
      dateStrings: true,
    });

    let sql = `SELECT book_id, title, author, price, quantity
  FROM orderedBook LEFT JOIN books
  ON orderedBook.book_id = books.id
  WHERE order_id = ?`;
    let [rows, fields] = await conn.query(sql, [orderId]);
    res.status(StatusCodes.OK).json(rows);
  }
};

module.exports = { order, getOrders, getOrderDetail };
