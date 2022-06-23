const jwt = require("jsonwebtoken");

const signAccesToken = async (payload, role) => {
  const user = payload;

  return jwt.sign(
    {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,

      role: role,
    },
    process.env.JWT_SECRET_ACCESS_TOKEN,
    {
      expiresIn: `45m`,
    }
  );
};

const resetTokenJWT = async (email) => {
  return jwt.sign(
    {
      email: email,
    },
    process.env.JWT_SECRET_ACCESS_TOKEN,
    {
      expiresIn: `5`,
    }
  );
};

module.exports = { signAccesToken, resetTokenJWT };
