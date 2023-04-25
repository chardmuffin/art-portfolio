const withAuth = (req, res, next) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session data:", req.session);

  if (!req.session.loggedIn) {
    res.status(401).json({ message: 'Unauthorized access' });
  } else {
    next();
  }
};

module.exports = withAuth;