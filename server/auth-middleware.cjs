/**
 * Middleware de json-server que simula la auth del backend:
 * sin Bearer, o con el token "expired", responde 401 → el front hace logout.
 */
module.exports = (req, res, next) => {
   if (req.method === "OPTIONS") return next();

   const authorization = req.headers.authorization;
   if (!authorization || authorization === "Bearer expired") {
      return res.status(401).jsonp({ message: "Tu sesión expiró. Volvé a iniciar sesión para seguir." });
   }

   return next();
};
