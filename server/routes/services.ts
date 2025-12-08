import express from "express";
import { Service } from "../models/Service";
import { authenticateAdmin } from "../middleware/authAdmin";

const router = express.Router();

router.get("/", async (req, res) => {
  const services = await Service.find();
  res.json(services);
});

router.post("/", authenticateAdmin, async (req, res) => {
  const service = new Service(req.body);
  await service.save();
  res.status(201).json(service);
});

router.delete("/:id", authenticateAdmin, async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ message: "Service supprimé" });
});

export { router as serviceRoutes };