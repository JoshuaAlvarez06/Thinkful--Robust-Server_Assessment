const router = require("express").Router({ mergeParams: true });
const controller = require("./urls.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const usesRouter = require("../uses/uses.router");
const usesController = require("../uses/uses.controller");

router
    .route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed);

router
    .route("/:urlId")
    .get(controller.read)
    .put(controller.update)
    .all(methodNotAllowed);

router.use("/:urlId/uses", controller.urlExists, usesRouter);
router.use("/:urlId/uses/:useId", controller.urlExists, usesController.useExistsWithUrl, usesRouter);

module.exports = router;