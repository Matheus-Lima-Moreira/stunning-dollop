import { Request, Response } from "express";
import ListRolesService from "../services/RoleServices/ListRolesService";
import ShowRoleService from "../services/RoleServices/ShowRoleService";
import DestroyRoleService from "../services/RoleServices/DestroyRoleService";
import CreateRoleService from "../services/RoleServices/CreateRoleService";
import UpdateRoleService from "../services/RoleServices/UpdateRoleService";
import { logger } from "../utils/logger";
import prisma from "../prisma";

export const index = async (req: Request, res: Response): Promise<Response> => {
  try {
    const roles = await ListRolesService();

    return res.json(roles);
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
    const role = await ShowRoleService(id);

    if (!role) return res.status(404).json({ error: "Cargo não encontrado" });

    return res.json(role);
  } catch (error: any) {
    return res.status(500).json({ error: "Erro interno, por favor entre em contato com o suporte" });
  }
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { name, permissions } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: "Nome fornecido é inválido." });
  }

  if (!permissions || !Array.isArray(permissions)) {
    return res.status(400).json({ error: "Permissões fornecidas são inválidas." });
  }

  try {
    const roleCreated = await CreateRoleService({ name, permissions });

    return res.status(201).json({
      message: "Cargo criado com sucesso!",
      role: roleCreated,
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Erro interno, por favor entre em contato com o suporte" });
  }
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { name, permissions } = req.body;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "ID fornecido é inválido" });
  }

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: "Nome fornecido é inválido." });
  }

  if (!permissions || !Array.isArray(permissions)) {
    return res.status(400).json({ error: "Permissões fornecidas são inválidas." });
  }

  try {
    const roleUpdated = await UpdateRoleService({
      id,
      name,
      permissions
    });

    if (!roleUpdated) {
      return res.status(404).json({ error: "Cargo não encontrado" });
    }

    return res.json({
      message: "Cargo atualizado com sucesso!",
      role: roleUpdated,
    });
  } catch (error: any) {
    logger.error(error);
    return res.status(500).json({ error: "Erro interno, por favor entre em contato com o suporte" });
  }
};

export const destroy = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "ID fornecido é inválido" });
  }

  try {
    const users = await prisma.user.findFirst({
      where: {
        roleId: parseInt(id)
      }
    });

    if (users) {
      return res.status(400).json({ error: "Existem usuários vinculados a este cargo, por favor desvincule-os antes de deletar o cargo." });
    }

    await DestroyRoleService(id);

    return res.json({
      message: "Cargo deletado com sucesso!",
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Erro interno, por favor entre em contato com o suporte" });
  }
};