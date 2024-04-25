const express = require("express");
const router = express.Router();
const { addLike, removeLike } = require("../controller/LikeController");

router.use(express.json());

router
  .route("/:id")
  // 좋아요 추가
  .post(addLike)
  // 좋아요 취소
  .delete(removeLike);

module.exports = router;
