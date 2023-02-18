const router = require("express").Router();
const Brand = require("../model/brand");
const verifyToken = require("../function/verifyToken");
const { paginatedResults } = require("../function/pagination");
const { createNewDoc } = require("../function/create");

router.get("/brand", paginatedResults(Brand, "brand"), (req, res) => {
  res.json(res.paginatedResults);
});
router.post(
  "/brand",
  verifyToken,
  createNewDoc(Brand, "brand"),
  async (req, res) => {
    res.json(res.data);
  }
);

router.get("/brand/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const brand = await Brand.findById(_id);
    if (!brand) {
      return res.status(500).json({ message: "brand not found" });
    }

    res.send(brand);
  } catch (e) {
    return res.status(500).json({ message: "brand not found" });
  }
});

router.patch("/brand/:id", verifyToken, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["_id", "name", "url", "categories", "image"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(500).json({ message: "invalid update" });
  }

  try {
    const brand = await Brand.findOne({
      _id: req.params.id,
    });

    if (!brand) {
      return res.status(500).json({ message: "brand not found" });
    }
    updates.forEach((update) => {
      brand[update] = req.body[update];
    });

    await brand.save();
    res.send(brand);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete("/brand/:id", verifyToken, async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(500).json({ message: "brand not found" });
    }
    await brand.remove();
    res.send(brand);
  } catch (e) {
    res.status(400).send(e);
  }
});
module.exports = router;
