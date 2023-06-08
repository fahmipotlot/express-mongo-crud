const { authJwt } = require("../middlewares");
const tutorials = require("../controllers/tutorial.controller.js");

var router = require("express").Router();

module.exports = app => {

  // Create a new Tutorial
  router.post(
    "/",
    [authJwt.verifyToken, authJwt.isAdmin],
    tutorials.create
  );

  // Retrieve all Tutorials
  router.get("/", tutorials.findAll);

  // Retrieve all published Tutorials
  router.get("/published", tutorials.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", tutorials.findOne);

  // Update a Tutorial with id
  router.put(
    "/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    tutorials.update
  );

  // Delete a Tutorial with id
  router.delete(
    "/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    tutorials.delete
  );

  // Delete all Tutorials
  router.delete(
    "/",    
    [authJwt.verifyToken, authJwt.isAdmin],
    tutorials.deleteAll
  );

  app.use('/api/tutorials', router);
};