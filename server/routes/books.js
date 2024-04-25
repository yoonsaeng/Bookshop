const express = require("express");
const router = express.Router();
const { allBooks, bookDetail } = require("../controller/BookController");

router.use(express.json());

// (카테고리 별, 신간 여부) 전체 도서 목록 조회
router.get("/", allBooks);

// 개별 도서 조회
router.get("/:id", bookDetail);

module.exports = router;
