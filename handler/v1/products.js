const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getPagination } = require("../../helpers/pagination");

// export fungsi account
module.exports = {
  // create new products
  createProducts: async (req, res, next) => {
    try {
      let { name, price, stock, description, transaction } = req.body;

      let newProducts = await prisma.products.create({
        data: {
          name,
          price,
          stock,
          description,
          transactions: {
            create: transaction,
          },
        },
      });

      res.status(201).json({
        status: true,
        message: "Created Product Successfuly!",
        data: newProducts
      });
    } catch (err) {
      next(err);
    }
  },

  // get All Products
  getAllProducts: async (req, res, next) => {
    try {
      let { limit = 10, page = 1 } = req.query;
      limit = Number(limit);
      page = Number(page);

      let products = await prisma.products.findMany({
        include: {
          transactions: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      });
      const { _count } = await prisma.products.aggregate({ _count: { productID: true } });

      let pagination = getPagination(req, _count.productID, page, limit);

      res.status(201).json({
        status: true,
        message: 'OK',
        data: { pagination, products }
      });
    } catch (err) {
      next(err);
    }
  },

  // get products detail by: id
  getDetailProducts: async (req, res, next) => {
    try {
      let { productID } = req.params;
      let products = await prisma.products.findUnique({ where: { productID: Number(productID) } });

      if (!products) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          data: 'No Products Found with Id ' + productID
        });
      }

      res.status(200).json({
        status: true,
        message: 'Details Products',
        data: products
      });
    } catch (err) {
      next(err);
    }
  },

  // update data products
  updateProducts: async (req, res, next) => {
    try {
      let { productID } = req.params;
      let { name, price, stock, description } = req.body;

      let updateOperation = await prisma.products.update({
        where: { productID: Number(productID) },
        data: {
          name,
          price,
          stock,
          description
        }
      });

      res.status(200).json({
        status: true,
        message: 'Updated Produucts Successfuly!',
        data: updateOperation
      });
    } catch (err) {
      next(err);
    }
  },

  // delete Products
  deleteProducts: async (req, res, next) => {
    try {
      let { productID } = req.params;

      let deleteOperation = await prisma.products.delete({
        where: { productID: Number(productID) }
      });

      res.status(200).json({
        status: true,
        message: "Deleted Users Successfuly!",
        data: deleteOperation
      });
    } catch (err) {
      next(err);
    }
  }
}