import { Router } from "express";
import * as dataController from "../controllers/dataController.js";

export const setupDataRoutes = (
  router,
  movieCollection,
  eventCollection,
  trainCollection
) => {
  // Movie routes
  router.get("/movies", (req, res) =>
    dataController.getMoviesController(req, res, movieCollection)
  );

  router.get("/movies/:id", (req, res) =>
    dataController.getMovieByIdController(req, res, movieCollection)
  );

  router.post("/movies", (req, res) =>
    dataController.createMovieController(req, res, movieCollection)
  );

  router.delete("/movies/:id", (req, res) =>
    dataController.deleteMovieController(req, res, movieCollection)
  );

  // Event routes
  router.get("/events", (req, res) =>
    dataController.getEventsController(req, res, eventCollection)
  );

  router.get("/events/:id", (req, res) =>
    dataController.getEventByIdController(req, res, eventCollection)
  );

  router.post("/events", (req, res) =>
    dataController.createEventController(req, res, eventCollection)
  );

  router.delete("/events/:id", (req, res) =>
    dataController.deleteEventController(req, res, eventCollection)
  );

  // Train routes
  router.get("/trains", (req, res) =>
    dataController.getTrainsController(req, res, trainCollection)
  );

  router.get("/trains/:trainNumber", (req, res) =>
    dataController.getTrainByNumberController(req, res, trainCollection)
  );

  router.post("/trains", (req, res) =>
    dataController.createTrainController(req, res, trainCollection)
  );

  router.delete("/trains/:trainNumber", (req, res) =>
    dataController.deleteTrainController(req, res, trainCollection)
  );

  return router;
};
