import knex from "../database/connection";
import { Request, Response } from "express";

class PointsController {
  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query;

    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const points = await knex("points")
      .join("point_items", "points.id", "=", "point_items.id_point")
      .whereIn("point_items.id_item", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");

    return res.json({ points });
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const point = await knex("points").where({ id }).first();

    const items = await knex("items")
      .join("point_items", "id_item", "=", "point_items.id_item")
      .where("point_items.id_point", id)
      .select("items.title");

    return point
      ? res.json({ point, items })
      : res.status(400).json({ message: "Ponto não encontrado" });
  }

  async store(req: Request, res: Response) {
    const { name, phone, latitude, longitude, uf, city, items } = req.body;

    const trx = await knex.transaction();

    const point = {
      image: "fake",
      name,
      phone,
      latitude,
      longitude,
      uf,
      city,
    };

    const insertedIdpoint = await trx("points").insert(point);

    const id_point = insertedIdpoint[0];

    const pointItems = items.map((id_item: number) => {
      return {
        id_item,
        id_point,
      };
    });

    await trx("point_items").insert(pointItems);

    await trx.commit();

    return res.status(201).json({ id: id_point, ...point });
  }
}

export default new PointsController();
