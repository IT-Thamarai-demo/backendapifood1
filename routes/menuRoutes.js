const router = require("express").Router();
const upload = require("../middlewares/upload");
const {
    createMenu,
    getMenus,
    getMenu,
    updateMenu,
    deleteMenu
} = require("../controllers/menuController");

// CREATE (with image)
router.post("/", upload.single("image"), createMenu);

// GET ALL
router.get("/", getMenus);

// GET ONE
router.get("/:id", getMenu);

// UPDATE (with optional new image)
router.put("/:id", upload.single("image"), updateMenu);

// DELETE
router.delete("/:id", deleteMenu);

module.exports = router;
