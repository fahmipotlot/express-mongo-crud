const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
  let token = "";
  const bearerToken = req.headers["authorization"];
  if (!bearerToken) {
    return res.status(403).send({ message: "No token provided!" });
  }

  if (typeof bearerToken !== undefined) {
    const bearer = bearerToken.split(" ")
    token = bearer[1]
  }

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findById(req.userId).then((user) => {
    Role.find(
      {
        _id: { $in: user.roles }
      }
    ).then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({ message: "Require Admin Role!" });
      return;
    });
  }).catch((err) => {
    res.status(500).send({ message: err });
    return;
  });
};

isModerator = (req, res, next) => {
  User.findById(req.userId).then((user) => {
    Role.find(
      {
        _id: { $in: user.roles }
      }
    ).then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
      }

      res.status(403).send({ message: "Require Moderator Role!" });
      return;
    });
  }).catch((err) => {
    res.status(500).send({ message: err });
    return;
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};
module.exports = authJwt;