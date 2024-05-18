import { Request, Response } from "express";
import ListUsersService from "../services/UserServices/ListUsersService";
import ShowUserService from "../services/UserServices/ShowUserService";
import CreateUserService from "../services/UserServices/CreateUserService";
import UpdateUserService from "../services/UserServices/UpdateUserService";
import DestroyUserService from "../services/UserServices/DestroyUserService";

export const index = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await ListUsersService();

    return res.json(users);
  } catch (error: any) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const user = await ShowUserService(id);

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json(user);
  } catch (error: any) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: "Invalid or missing name" });
  }

  if (!email || typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Invalid or missing email" });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: "Invalid or missing password. Password must be at least 6 characters long." });
  }

  try {
    const userCreated = await CreateUserService({ name, email, password });

    return res.status(201).json({
      message: "User created successfully!",
      user: userCreated,
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid or missing id" });
  }

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: "Invalid or missing name" });
  }

  if (!email || typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Invalid or missing email" });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: "Invalid or missing password. Password must be at least 6 characters long." });
  }

  try {
    const userUpdated = await UpdateUserService({
      id,
      name,
      email,
      password
    });

    if (!userUpdated) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      message: "User updated successfully!",
      user: userUpdated,
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const destroy = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid or missing id" });
  }

  try {
    await DestroyUserService(id);

    return res.json({
      message: "User deleted successfully!!"
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Internal server error" });
  }
};