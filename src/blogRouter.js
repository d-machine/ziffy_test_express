const express = require("express");
const blogController =  require("./blogController");

// Init express router
const router = express.Router();

// Just to ping and check the server
router.get('/', function(req, res) {
    res.json({ success: true})
})

router.get('/blogs', blogController.getBlogs)
router.get('/blogs/:id', blogController.getBlogById)
router.post('/blogs', blogController.createBlog)

// export router
module.exports = router;
