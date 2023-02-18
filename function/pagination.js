function paginatedResults(model, type) {
  return async (req, res, next) => {
    let { page, limit, sort, search = "" } = req.query;
    let populate = null;
    if (!search) {
      try {
        if (!page) {
          page = 1;
        }
        if (!limit) {
          limit = 50;
        }
        if (!sort) {
          sort = { createdAt: "-1" };
        }
        if (type === "chat") {
          populate = {
            path: "users",
            select: "firstName lastName image",
          };
        }
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const sortQuery = sort;
        const query = req.query;
        delete query.sort;
        delete query.limit;
        delete query.page;
        const results = {};
        const total = await model.countDocuments(query).exec();
        results.total = total;
        results.skip = startIndex;
        results.limit = endIndex;
        results.data = await model
          .find(query)
          .populate(populate)
          .limit(endIndex)
          .skip(startIndex)
          .sort(sortQuery)
          .exec();
        res.paginatedResults = results;
        next();
      } catch (e) {
        console.log("ERROR...", e.message);
        res.status(500).json({ message: e.message });
      }
    }
    next();
  };
}
module.exports.paginatedResults = paginatedResults;
