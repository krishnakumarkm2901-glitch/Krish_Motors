const jwt = require("jsonwebtoken");

const config = require("../config");
const User = require("../models/user");

function createToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

async function readUserFromToken(request) {
  const authorization = request.get("Authorization") || "";
  if (!authorization.startsWith("Bearer ")) return null;

  const payload = jwt.verify(authorization.slice(7), config.jwtSecret);
  return User.findById(payload.sub);
}

function requireAuth(requiredRole) {
  return async function authenticate(request, response, next) {
    try {
      const user = await readUserFromToken(request);

      if (!user) {
        return response.status(401).json({ message: "Authentication required." });
      }

      if (requiredRole && user.role !== requiredRole) {
        return response.status(403).json({ message: "Access denied." });
      }

      request.user = user;
      return next();
    } catch (_error) {
      return response.status(401).json({ message: "Invalid or expired session." });
    }
  };
}

async function optionalAuth(request, _response, next) {
  try {
    request.user = await readUserFromToken(request);
  } catch (_error) {
    request.user = null;
  }
  next();
}

module.exports = { createToken, requireAuth, optionalAuth };
