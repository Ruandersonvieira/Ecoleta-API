import express from "express";

const routes = express.Router();

routes.get("/", (req, res) => {
  return res.json({ status: "Server running" });
});

export default routes;
