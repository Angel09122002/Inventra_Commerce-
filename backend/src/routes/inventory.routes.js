const router = require("express").Router();
const {
  getAllInventory,
  getByProduct,
  restock,
} = require("../controllers/inventory.controller");

router.get("/", getAllInventory);
router.get("/:productId", getByProduct);
router.post("/restock", restock);

module.exports = router;
