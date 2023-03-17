const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// GET all products
router.get("/", async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const prodData = await Product.findAll({
      include: [{ model: Category, Tag }],
    });
    res.status(200).json(prodData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET one product
router.get("/:id", async (req, res) => {
  try {
    const pData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }],
    });

    if (!pData) {
      res.status(404).json({ message: "No product found with this id!" });
      return;
    }

    res.status(200).json(catData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE new product
router.post("/", async (req, res) => {
    try {
      const pData = await Product.create(req.body);
      res.status(200).json(pData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

// update product
router.put("/:id", (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// DELETE one product by its `id` value
router.delete("/:id", async (req, res) => {
  try {
    const prodData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(prodData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
