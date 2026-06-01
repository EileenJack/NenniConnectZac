// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import User from "../models/userModel";

declare global {
  namespace Express {
    interface Request {
      auth0Id: string;
      userId: string;
    }
  }
}

const auth0Audience = process.env.AUTH0_AUDIENCE;
const auth0Issuer = process.env.AUTH0_ISSUER_BASE_URL;

if (!auth0Audience || !auth0Issuer) {
  throw new Error(
    "Faltan variables de entorno de Auth0: AUTH0_AUDIENCE o AUTH0_ISSUER_BASE_URL",
  );
}

export const jwtCheck = auth({
  audience: auth0Audience,
  issuerBaseURL: auth0Issuer,
  tokenSigningAlg: "RS256",
});

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // Usamos cast a cualquier tipo para extraer sub
  const auth0Id = (req.auth as any)?.payload?.sub as string | undefined;

  if (!auth0Id) {
    console.log('jwtParse - No se encontró el claim "sub" en el token');
    res.status(401).json({ message: "Autorización denegada" });
    return;
  }

  try {
    const user = await User.findOne({ auth0Id });

    if (!user) {
      console.log(
        `jwtParse - Usuario con auth0Id ${auth0Id} no encontrado en la base de datos`,
      );
      res
        .status(401)
        .json({ message: "Usuario no registrado en la base de datos" });
      return;
    }

    req.auth0Id = auth0Id;
    req.userId = user._id.toString();

    console.log("jwtParse - Autorización concedida");
    next();
  } catch (error) {
    console.log("jwtParse - catch Autorización denegada", error);
    res.status(401).json({ message: "Autorización denegada" });
  }
};
