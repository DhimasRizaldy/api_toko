-- CreateTable
CREATE TABLE "Users" (
    "userID" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "Profiles" (
    "profileID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "telpon" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "Profiles_pkey" PRIMARY KEY ("profileID")
);

-- CreateTable
CREATE TABLE "Products" (
    "productID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("productID")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "transactionID" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "productID" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("transactionID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profiles_userID_key" ON "Profiles"("userID");

-- AddForeignKey
ALTER TABLE "Profiles" ADD CONSTRAINT "Profiles_userID_fkey" FOREIGN KEY ("userID") REFERENCES "Users"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_userID_fkey" FOREIGN KEY ("userID") REFERENCES "Users"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_productID_fkey" FOREIGN KEY ("productID") REFERENCES "Products"("productID") ON DELETE RESTRICT ON UPDATE CASCADE;
