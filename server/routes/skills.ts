import express from "express";
import { Skill } from "../models/Skill";
import { authenticateAdmin } from "../middleware/authAdmin";

const router = express.Router();

router.get("/", async (req, res) => {
  const skills = await Skill.find();
  res.json(skills);
});

router.post("/", authenticateAdmin, async (req, res) => {
  const skill = new Skill(req.body);
  await skill.save();
  res.status(201).json(skill);
});

router.delete("/:id", authenticateAdmin, async (req, res) => {
  await Skill.findByIdAndDelete(req.params.id);
  res.json({ message: "Compétence supprimée" });
});

export { router as skillRoutes };