const express = require("express");
const router = express.Router();
const {
  order,
  getOrders,
  getOrderDetail,
} = require("../controller/OrderController");

router.use(express.json());

router
  .route("/")
  // 결제하기 = 주문하기 = 주문 등록 = 데이터베이스 주문 insert
  .post(order)
  // 주문 목록(내역) 조회
  .get(getOrders);

// 주문 상세 상품 조회
router.get("/:id", getOrderDetail);

module.exports = router;
