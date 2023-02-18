const router = require("express").Router();
const BrandCategory = require("../model/brandCategory");
const Brand = require("../model/brand");
const verifyToken = require("../function/verifyToken");
const { paginatedResults } = require("../function/pagination");
const { createNewDoc } = require("../function/create");

router.get(
  "/brandCategory",
  paginatedResults(BrandCategory, "brandCategory"),
  (req, res) => {
    res.json(res.paginatedResults);
  }
);
router.post(
  "/brandCategory",
  verifyToken,
  createNewDoc(BrandCategory, "brandCategory"),
  async (req, res) => {
    res.json(res.data);
    const brand = await Brand.findById(res.data.brand);
    let categories = brand["categories"];
    if (!categories.includes(res.data.title)) {
      categories.push(res.data.title);
    }
    brand["categories"] = categories;
    await brand.save();
  }
);

router.get("/brandCategory/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const brandCategory = await BrandCategory.findById(_id);
    if (!brandCategory) {
      return res.status(500).json({ message: "brand category not found" });
    }

    res.send(brandCategory);
  } catch (e) {
    return res.status(500).json({ message: "brand category not found" });
  }
});

router.patch("/brandCategory/:id", verifyToken, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["_id", "title", "url", "images", "brand"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(500).json({ message: "invalid update" });
  }

  try {
    const brandCategory = await BrandCategory.findOne({
      _id: req.params.id,
    });

    if (!brandCategory) {
      return res.status(500).json({ message: "brand category not found" });
    }
    updates.forEach((update) => {
      brandCategory[update] = req.body[update];
    });
    await brandCategory.save();
    res.send(brandCategory);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete("/brandCategory/:id", verifyToken, async (req, res) => {
  try {
    const brandCategory = await BrandCategory.findById(req.params.id);
    if (!brandCategory) {
      return res.status(500).json({ message: "brandCategory not found" });
    }
    await brandCategory.remove();
    res.send(brandCategory);

    const brand = await Brand.findById(brandCategory.brand);
    let categories = brand["categories"];
    if (categories.includes(brandCategory.title)) {
      categories = categories.filter((e) => e !== brandCategory.title);
    }
    brand["categories"] = categories;
    await brand.save();
  } catch (e) {
    res.status(400).send(e);
  }
});
module.exports = router;
