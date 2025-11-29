//
const Search = require("../models/Search");
const logger = require("../utils/logger");

const searchController = async (req, res) => {
  logger.info("Search endpoint hit!");
  try {
    // ✅ Correct: Extract the 'query' parameter from req.query
    const { query } = req.query;

    // Add validation
    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required",
      });
    }

    logger.info(`Searching for: "${query}"`);

    const results = await Search.find(
      {
        $text: {
          $search: query, // Now this will be a string like "2nd"
        },
      },
      {
        score: { $meta: "textScore" },
      },
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10);

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    logger.error("Error while searching post", error);
    res.status(500).json({
      success: false,
      message: "Error while searching post",
    });
  }
};

module.exports = { searchController };
