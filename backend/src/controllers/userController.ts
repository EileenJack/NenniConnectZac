import { Request, Response } from "express";
import crypto from "node:crypto";
import User from "../models/userModel";

const hashPassword = (password: string, salt = crypto.randomBytes(16).toString("hex")) => ({
  salt,
  hash: crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex"),
});

// Vincular Auth0 con usuario previamente registrado en MongoDB
export const createUser = async (req: Request, res: Response) => {
  const auth0Id = (req.auth as any)?.payload?.sub as string | undefined;
  const { email, name } = req.body as { email?: string; name?: string };

  if (!auth0Id || !email) {
    res.status(400).json({ message: "Faltan datos para verificar usuario" });
    return;
  }

  try {
    let user = await User.findOne({ auth0Id });

    if (!user) {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    if (!user) {
      res.status(404).json({
        message: "Usuario no registrado en el sistema. Contacta al administrador.",
      });
      return;
    }

    if (user.bloqueado) {
      res.status(403).json({ message: "Usuario bloqueado" });
      return;
    }

    if (!user.auth0Id) {
      user.auth0Id = auth0Id;
      if (name && !user.name) user.name = name;
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verificando usuario" });
  }
};

export const registerAuth0User = async (req: Request, res: Response) => {
  const auth0Id = (req.auth as any)?.payload?.sub as string | undefined;
  const tokenEmail = (req.auth as any)?.payload?.email as string | undefined;
  const { email, name, usuario, rol = "cliente" } = req.body as {
    email?: string;
    name?: string;
    usuario?: string;
    rol?: "cliente" | "emprendedor" | "admin";
  };

  if (!auth0Id || !email || !name || !usuario) {
    res.status(400).json({
      message: "Faltan campos obligatorios",
      campos: ["email", "name", "usuario"],
    });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (tokenEmail && tokenEmail.toLowerCase() !== normalizedEmail) {
    res.status(403).json({
      message: "El correo debe coincidir con tu cuenta de Auth0",
    });
    return;
  }

  try {
    const existing = await User.findOne({
      $or: [{ email: normalizedEmail }, { auth0Id }, { usuario: usuario.trim() }],
    });

    if (existing) {
      res.status(409).json({ message: "El usuario o correo ya esta registrado" });
      return;
    }

    const user = await User.create({
      auth0Id,
      email: normalizedEmail,
      name: name.trim(),
      usuario: usuario.trim(),
      rol,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registrando usuario" });
  }
};

export const registerUsuario = async (req: Request, res: Response) => {
  try {
    const {
      usuario,
      correo,
      email,
      clave,
      name,
      rol = "cliente",
    } = req.body as {
      usuario?: string;
      correo?: string;
      email?: string;
      clave?: string;
      name?: string;
      rol?: "cliente" | "emprendedor" | "admin";
    };
    const userEmail = correo ?? email;

    if (!usuario || !userEmail || !clave) {
      res.status(400).json({
        error: "Faltan campos obligatorios",
        campos: ["usuario", "correo", "clave"],
      });
      return;
    }

    const existingUser = await User.findOne({ email: userEmail });
    if (existingUser) {
      res.status(400).json({ error: "El correo ya esta registrado" });
      return;
    }

    const { salt, hash } = hashPassword(clave);
    const user = await User.create({
      usuario,
      email: userEmail,
      name: name ?? usuario,
      passwordSalt: salt,
      passwordHash: hash,
      rol,
    });

    res.status(201).json({ mensaje: "Usuario registrado correctamente", usuario: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error registrando usuario" });
  }
};

export const loginUsuario = async (req: Request, res: Response) => {
  try {
    const { correo, email, clave } = req.body as {
      correo?: string;
      email?: string;
      clave?: string;
    };
    const userEmail = correo ?? email;

    if (!userEmail || !clave) {
      res.status(400).json({
        error: "Faltan campos obligatorios",
        campos: ["correo", "clave"],
      });
      return;
    }

    const user = await User.findOne({ email: userEmail });
    if (!user || !user.passwordHash || !user.passwordSalt) {
      res.status(401).json({ error: "Credenciales incorrectas" });
      return;
    }

    const { hash } = hashPassword(clave, user.passwordSalt);
    if (hash !== user.passwordHash || user.bloqueado) {
      res.status(401).json({ error: "Credenciales incorrectas" });
      return;
    }

    res.status(200).json({ mensaje: "Inicio de sesion correcto", usuario: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error iniciando sesion" });
  }
};

export const listUsuarios = async (_req: Request, res: Response) => {
  try {
    const usuarios = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json({ mensaje: "Usuarios obtenidos correctamente", usuarios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo usuarios" });
  }
};

export const updateUsuario = async (req: Request, res: Response) => {
  try {
    const update: any = {};
    const { usuario, correo, email, clave, name, rol, bloqueado } = req.body;

    if (usuario) update.usuario = usuario;
    if (correo || email) update.email = correo ?? email;
    if (name) update.name = name;
    if (rol) update.rol = rol;
    if (typeof bloqueado === "boolean") update.bloqueado = bloqueado;
    if (clave) {
      const { salt, hash } = hashPassword(clave);
      update.passwordSalt = salt;
      update.passwordHash = hash;
    }

    const usuarioActualizado = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!usuarioActualizado) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.status(200).json({
      mensaje: "Usuario actualizado correctamente",
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando usuario" });
  }
};

export const deleteUsuario = async (req: Request, res: Response) => {
  try {
    const usuario = await User.findByIdAndUpdate(
      req.params.id,
      { bloqueado: true },
      { new: true },
    );

    if (!usuario) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.status(200).json({ mensaje: "Usuario bloqueado correctamente", usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error bloqueando usuario" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const auth0Id = (req.auth as any)?.payload?.sub as string | undefined;

  if (!auth0Id) {
    res.status(401).json({ message: "Token invalido" });
    return;
  }

  try {
    const user = await User.findOne({ auth0Id });

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo usuario" });
  }
};
