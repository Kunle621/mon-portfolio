// middleware/authAdmin.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin";

export const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Accès non autorisé" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ error: "Admin introuvable" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalide" });
  }
};