const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCartItems,
  removeCartItem,
} = require("../controller/CartController");

router.use(express.json());

router
  .route("/")
  // 장바구니 담기
  .post(addToCart)
  // 장바구니 아이템 목록 조회, 선택된 장바구니 아이템 목록 조회
  .get(getCartItems);

// 장바구니 도서 삭제
router.delete("/:id", removeCartItem);

module.exports = router;
