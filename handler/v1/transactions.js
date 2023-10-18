const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient;
const { getPagination } = require("../../helpers/pagination");

module.exports = {
  // Membuat transaksi baru
  createTransactions: async (req, res, next) => {
    try {
      let { userID, productID, date, quantity } = req.body;

      // Mendapatkan produk berdasarkan ID
      let product = await prisma.products.findUnique({ where: { productID: productID } });

      // Menghitung total harga
      let total = product.price * quantity;

      // Memeriksa apakah stok produk cukup
      if (product.stock >= quantity) {
        // Memperbarui stok produk
        await prisma.products.update({ where: { productID: productID }, data: { stock: product.stock - quantity } });

        // Membuat transaksi baru
        let transaction = await prisma.transactions.create({
          data: {
            user: { connect: { userID: userID } },
            product: { connect: { productID: productID } },
            date: date,
            quantity: quantity,
            total: total,
          },
        });

        // Menyampaikan pesan keberhasilan
        res.status(200).json({ message: "Created Transaction Successfuly!" });
      } else {
        // Menyampaikan pesan kesalahan
        res.status(400).json({ message: "Stok produk tidak mencukupi" });
      }
    } catch (err) {
      next(err);
    }
  },

  // Mendapatkan semua data transaksi
  getAllTransactions: async (req, res, next) => {
    try {
      let { limit = 10, page = 1 } = req.query;
      limit = Number(limit);
      page = Number(page);

      let transactions = await prisma.transactions.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });

      const { _count } = await prisma.transactions.aggregate({
        _count: { transactionID: true }
      });

      let pagination = getPagination(req, _count.transactionID, page, limit);

      res.status(200).json({
        status: true,
        message: "OK",
        data: { pagination, transactions }
      });

    } catch (err) {
      next(err);
    }
  },

  // get transaction data by:id
  getDetailTransaction: async (req, res, next) => {
    try {
      let { transactionID } = req.params;
      let transactions = await prisma.transactions.findUnique({
        where: { transactionID: Number(transactionID) }
      });

      if (!transactions) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          data: 'No Transactions Found with Id ' + transactionID
        });
      }

      res.status(200).json({
        status: true,
        message: 'Details Transactions',
        data: transactions
      });
    } catch (err) {
      next(err);
    }
  },

  // update data transaction
  // updateTransactions: async (req, res, next) => {
  //   try {
  //     let { transactionID } = req.params;
  //     let { userID, productID, date, quantity, total } = req.body;

  //     let updateOperation = await prisma.transactions.update({
  //       where: { transactionID: Number(transactionID) },
  //       data: {
  //         userID,
  //         productID,
  //         date,
  //         quantity,
  //         total
  //       }
  //     });

  //     res.status(200).json({
  //       status: true,
  //       message: 'Updated Transactions Successfuly!',
  //       data: updateOperation
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  updateTransactions: async (req, res, next) => {
    try {
      let { transactionID } = req.params;
      let { userID, productID, date, quantity } = req.body;

      // Dapatkan transaksi yang akan diubah
      let existingTransaction = await prisma.transactions.findUnique({ where: { transactionID: Number(transactionID) } });

      if (!existingTransaction) {
        res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        return;
      }

      // Dapatkan produk yang terkait dengan transaksi
      let product = await prisma.products.findUnique({ where: { productID: existingTransaction.productID } });

      // Menghitung total harga berdasarkan jumlah yang diubah
      let total = product.price * quantity;

      // Menghitung selisih jumlah baru dengan jumlah lama
      let quantityDiff = quantity - existingTransaction.quantity;

      // Update stok produk sesuai dengan selisih jumlah
      await prisma.products.update({
        where: { productID: existingTransaction.productID },
        data: { stock: product.stock + quantityDiff }
      });

      // Update data transaksi
      let updateOperation = await prisma.transactions.update({
        where: { transactionID: Number(transactionID) },
        data: {
          userID,
          productID,
          date,
          quantity,
          total
        }
      });

      res.status(200).json({
        status: true,
        message: 'Updated Transaction Successfuly!',
        data: updateOperation
      });
    } catch (err) {
      next(err);
    }
  },

  // delete transaction
  deleteTransactions: async (req, res, next) => {
    try {
      let { transactionID } = req.params;

      // Dapatkan data transaksi yang akan dihapus
      let transactionToDelete = await prisma.transactions.findUnique({ where: { transactionID: Number(transactionID) } });

      if (!transactionToDelete) {
        res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        return;
      }

      // Dapatkan produk yang terkait dengan transaksi
      let product = await prisma.products.findUnique({ where: { productID: transactionToDelete.productID } });

      // Mengembalikan stok produk
      await prisma.products.update({
        where: { productID: transactionToDelete.productID },
        data: { stock: product.stock + transactionToDelete.quantity }
      });

      // Hapus transaksi
      await prisma.transactions.delete({
        where: { transactionID: Number(transactionID) }
      });

      res.status(200).json({
        status: true,
        message: 'Transaksi berhasil dihapus! Stok produk telah dikembalikan.',
        data: transactionToDelete
      });
    } catch (err) {
      next(err);
    }
  }
}