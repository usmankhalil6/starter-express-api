const router = require("express").Router();
const Notifications = require("../model/notifications");
const verifyToken = require("../function/verifyToken");
const { paginatedResults } = require("../function/pagination");
const { createNewDoc } = require("../function/create");

router.get(
  "/notifications",
  paginatedResults(Notifications, "notifications"),
  (req, res) => {
    res.json(res.paginatedResults);
  }
);

router.post(
  "/notifications",
  verifyToken,
  createNewDoc(Notifications, "notifications"),
  async (req, res) => {
    res.json(res.data);
  }
);

router.delete("/notifications/:id", verifyToken, async (req, res) => {
  try {
    const notifications = await Notifications.findById(req.params.id);
    if (!notifications) {
      return res.status(500).json({ message: "notifications not found" });
    }
    await notifications.remove();
    res.send(notifications);
  } catch (e) {
    res.status(400).send(e);
  }
});
module.exports = router;
