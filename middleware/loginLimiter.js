const rateLimit = require("express-rate-limit");
const { logEvents } = require("./logger");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each ip  to 5 login request per window per minute
  message: {
    message: "Too many login attempts from this IP, try again after 60 secs",
  },
  handler: (req, res, next, options) => {
    logEvents(
      `Too Many Request:${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "err.log"
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // return rateLimit info in the ratelimit-* headers
  legacyHeaders: false, // diable the x-ratelimit-* headers
});

module.exports = loginLimiter;
