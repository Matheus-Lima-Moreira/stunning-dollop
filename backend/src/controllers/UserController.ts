import { Request, Response } from "express";
import ListUsersService from "../services/UserServices/ListUsersService";
import ShowUserService from "../services/UserServices/ShowUserService";
import CreateUserService from "../services/UserServices/CreateUserService";
import UpdateUserService from "../services/UserServices/UpdateUserService";
import DestroyUserService from "../services/UserServices/DestroyUserService";

export const index = async (req: Request, res: Response): Promise<Response> => {  
  try {
    const users = await ListUsersService(req.session.user?.id);

    return res.json(users);
  } catch (error: any) {
    return res.status(500).json({ error: "Erro interno, por favor entre em contato com o suporte" });
  }
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "ID fornecido é inválido" });
  }

  try {
    const user = await ShowUserService(id);

    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    return res.json(user);
  } catch (error: any) {
    return res.status(500).json({ error: "Erro interno, por favor entre em contato com o suporte" });
  }
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: "Nome fornecido é inválido" });
  }

  if (!email || typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "E-mail fornecido é inválido" });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: "Senha fornecida é inválida. A senha deve ter pelo menos 6 caracteres." });
  }

  try {
    const userCreated = await CreateUserService({ name, email, password });

    return res.status(201).json({
      message: "Usuário criado com sucesso!",
      user: userCreated,
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Erro interno, por favor entre em contato com o suporte" });
  }
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "ID fornecido é inválido" });
  }

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: "Nome fornecido é inválido" });
  }

  if (!email || typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Nome fornecido é inválido" });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: "Senha fornecida é inválida. A senha deve ter pelo menos 6 caracteres." });
  }

  try {
    const userUpdated = await UpdateUserService({
      id,
      name,
      email,
      password
    });

    if (!userUpdated) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.json({
      message: "Usuário atualizado com sucesso!",
      user: userUpdated,
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Erro interno, por favor entre em contato com o suporte" });
  }
};

export const destroy = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "ID fornecido é inválido" });
  }

  try {
    await DestroyUserService(id);

    return res.json({
      message: "Usuário deletado com sucesso!",
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Erro interno, por favor entre em contato com o suporte" });
  }
};