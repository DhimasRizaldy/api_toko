const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getPagination } = require("../../helpers/pagination");

module.exports = {
  // create new users
  createUsers: async (req, res, next) => {
    try {
      let { username, email, password, profile } = req.body;
      let users = await prisma.users.create({
        data: {
          username,
          email,
          password,
          profile: {
            create: profile,
          },
        },
      });

      res.status(201).json({
        status: true,
        message: "Created Users Successfuly!",
        data: users,
      });
    } catch (err) {
      next(err);
    }
  },

  // get All Users
  getAllUsers: async (req, res, next) => {
    try {
      let { limit = 10, page = 1 } = req.query;
      limit = Number(limit);
      page = Number(page);

      let users = await prisma.users.findMany({
        include: {
          profile: true,
          transactions: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      });
      const { _count } = await prisma.users.aggregate({ _count: { userID: true } });

      let pagination = getPagination(req, _count.userID, page, limit);

      res.status(201).json({
        status: true,
        message: 'OK',
        data: { pagination, users }
      });
    } catch (err) {
      next(err);
    }
  },

  // get users detail data by: id
  getDetailUsers: async (req, res, next) => {
    try {
      let { userID } = req.params;

      let users = await prisma.users.findUnique({
        where: {
          userID: Number(userID),
        },
        include: {
          profile: true,
          transactions: true,
        },
      });

      if (!users) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          data: 'No Users Found with Id ' + userID
        });
      }

      res.status(200).json({
        status: true,
        message: 'OK',
        data: users
      });
    } catch (err) {
      next(err);
    }
  },

  // update data users
  updateUsers: async (req, res, next) => {
    try {
      let { userID } = req.params;
      let { username, email, password, profile } = req.body;

      let updateOperation = await prisma.users.update({
        where: { userID: Number(userID) },
        data: {
          username,
          email,
          password,
          profile: {
            create: profile,
          }
        },
        include: { profile: true },
      });

      res.status(200).json({
        status: true,
        message: "Updated Users Successfuly!",
        data: updateOperation,
      });
    } catch (err) {
      next(err);
    }
  },

  //  delete Users
  deleteUsers: async (req, res, next) => {
    try {
      let { userID } = req.params;

      let deleteOperation = await prisma.users.delete({
        where: { userID: Number(userID) }
      });

      res.status(200).json({
        status: true,
        message: " Deleted Users Successfuly!",
        data: deleteOperation
      });
    } catch (err) {
      next(err);
    }
  }
}
