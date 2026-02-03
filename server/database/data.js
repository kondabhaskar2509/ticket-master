function setupData(app, movieCollection, eventCollection, trainCollection) {

  app.get("/movies", async (req, res) => {
    try {
      const movies = await movieCollection.find({}).toArray();
      res.json(movies);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch movies" });
    }
  });
  app.get("/movies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const movie = await movieCollection.findOne({ id });
      if (!movie) return res.status(404).json({ error: "Movie not found" });
      res.json(movie);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch movie" });
    }
  });
  app.post("/movies", async (req, res) => {
    try {
      const movie = req.body;
      const result = await movieCollection.insertOne(movie);
      res.status(201).json({ status: "success", id: result.insertedId });
    } catch (err) {
      res.status(500).json({ error: "Failed to create movie" });
    }
  });
  app.delete("/movies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await movieCollection.deleteOne({ id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Movie not found" });
      }
      res.json({ status: "success" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete movie" });
    }
  });


  
  app.get("/events", async (req, res) => {
    try {
      const events = await eventCollection.find({}).toArray();
      res.json(events);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });
  app.get("/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await eventCollection.findOne({ id });
      if (!event) return res.status(404).json({ error: "Event not found" });
      res.json(event);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });
  app.post("/events", async (req, res) => {
    try {
      const event = req.body;
      const result = await eventCollection.insertOne(event);
      res.status(201).json({ status: "success", id: result.insertedId });
    } catch (err) {
      res.status(500).json({ error: "Failed to create event" });
    }
  });
  app.delete("/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await eventCollection.deleteOne({ id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json({ status: "success" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete event" });
    }
  });


  app.get("/trains", async (req, res) => {
    try {
      const trains = await trainCollection.find({}).toArray();
      res.json(trains);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch trains" });
    }
  });
  app.get("/trains/:trainNumber", async (req, res) => {
    try {
      const trainNumber = req.params.trainNumber;
      const train = await trainCollection.findOne({ trainNumber });
      if (!train) return res.status(404).json({ error: "Train not found" });
      res.json(train);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch train" });
    }
  });
}

export default setupData;
