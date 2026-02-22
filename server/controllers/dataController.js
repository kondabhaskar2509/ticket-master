// Movie Controllers
export const getMoviesController = async (req, res, movieCollection) => {
  try {
    const movies = await movieCollection.find({}).toArray();
    res.json(movies);
  } catch (err) {
    console.error("Error fetching movies:", err);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
};

export const getMovieByIdController = async (req, res, movieCollection) => {
  try {
    const id = parseInt(req.params.id);
    const movie = await movieCollection.findOne({ id });

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json(movie);
  } catch (err) {
    console.error("Error fetching movie:", err);
    res.status(500).json({ error: "Failed to fetch movie" });
  }
};

export const createMovieController = async (req, res, movieCollection) => {
  try {
    const movie = req.body;

    if (!movie.title || !movie.id) {
      return res.status(400).json({ error: "Title and id are required" });
    }

    const result = await movieCollection.insertOne(movie);
    res.status(201).json({
      status: "success",
      id: result.insertedId,
    });
  } catch (err) {
    console.error("Error creating movie:", err);
    res.status(500).json({ error: "Failed to create movie" });
  }
};

export const deleteMovieController = async (req, res, movieCollection) => {
  try {
    const id = parseInt(req.params.id);
    const result = await movieCollection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json({ status: "success" });
  } catch (err) {
    console.error("Error deleting movie:", err);
    res.status(500).json({ error: "Failed to delete movie" });
  }
};

// Event Controllers
export const getEventsController = async (req, res, eventCollection) => {
  try {
    const events = await eventCollection.find({}).toArray();
    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

export const getEventByIdController = async (req, res, eventCollection) => {
  try {
    const id = parseInt(req.params.id);
    const event = await eventCollection.findOne({ id });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

export const createEventController = async (req, res, eventCollection) => {
  try {
    const event = req.body;

    if (!event.title || !event.id) {
      return res.status(400).json({ error: "Title and id are required" });
    }

    const result = await eventCollection.insertOne(event);
    res.status(201).json({
      status: "success",
      id: result.insertedId,
    });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
};

export const deleteEventController = async (req, res, eventCollection) => {
  try {
    const id = parseInt(req.params.id);
    const result = await eventCollection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ status: "success" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Failed to delete event" });
  }
};

// Train Controllers
export const getTrainsController = async (req, res, trainCollection) => {
  try {
    const trains = await trainCollection.find({}).toArray();
    res.json(trains);
  } catch (err) {
    console.error("Error fetching trains:", err);
    res.status(500).json({ error: "Failed to fetch trains" });
  }
};

export const getTrainByNumberController = async (req, res, trainCollection) => {
  try {
    const trainNumber = req.params.trainNumber;
    const train = await trainCollection.findOne({ trainNumber });

    if (!train) {
      return res.status(404).json({ error: "Train not found" });
    }

    res.json(train);
  } catch (err) {
    console.error("Error fetching train:", err);
    res.status(500).json({ error: "Failed to fetch train" });
  }
};

export const createTrainController = async (req, res, trainCollection) => {
  try {
    const train = req.body;

    if (!train.trainNumber) {
      return res.status(400).json({ error: "Train number is required" });
    }

    const result = await trainCollection.insertOne(train);
    res.status(201).json({
      status: "success",
      id: result.insertedId,
    });
  } catch (err) {
    console.error("Error creating train:", err);
    res.status(500).json({ error: "Failed to create train" });
  }
};

export const deleteTrainController = async (req, res, trainCollection) => {
  try {
    const trainNumber = req.params.trainNumber;
    const result = await trainCollection.deleteOne({ trainNumber });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Train not found" });
    }

    res.json({ status: "success" });
  } catch (err) {
    console.error("Error deleting train:", err);
    res.status(500).json({ error: "Failed to delete train" });
  }
};
