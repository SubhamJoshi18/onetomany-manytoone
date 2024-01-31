import "reflect-metadata";
import express from "express";
import { DataSource, LessThan } from "typeorm";
import { Company } from "./entities/Company";
import { Product } from "./entities/Product";
const app = express();
const port = 3000;
app.use(express.json());

app.post("/", async (req, res) => {
  const companyRepo = appDataSource.getRepository(Company);
  let products: Product[] = [];
  let iphone = new Product();
  iphone.name = "Iphone";
  iphone.description = "IOS phone";
  iphone.price = 250000;

  let macbook = new Product();
  macbook.name = "MacBook";
  macbook.description = "IOS Laptop";
  macbook.price = 120000;

  let ipad = new Product();
  ipad.name = "Ipad";
  ipad.description = "IOS IPAD";
  ipad.price = 150000;

  products.push(iphone, macbook, ipad);

  let company: Company = new Company();
  company.name = "Apple";
  company.description = "IOS COMPANY NEPAL";
  company.product = products;
  const dataInserted = await companyRepo.save(company);
  res.json({
    data: {
      dataInserted,
    },
  });
});

app.get("/", async (req, res) => {
  const companyRepo = appDataSource.getRepository(Company);
  const getall = await companyRepo.find({
    //find the relation data
    relations: {
      product: true,
    },
    //filter the data relations
    where: {
      product: {
        price: LessThan(300000),
      },
    },
  });
  res.json(getall);
});

app.patch("/:id", async (req, res) => {
  const id: number = parseInt(req.params.id);
  const companyRepo = appDataSource.getRepository(Company);
  const findcompany = await companyRepo.findOne({
    where: {
      //find based on criteria
      id: id,
    },
  });
  if (findcompany != undefined) {
    findcompany.name = "Apple Updated";
    for (let x = 0; x < findcompany.product.length; x++) {
      findcompany.product[x].price = 10;
    }
    const updated = await companyRepo.save(findcompany);
    res.json({
      data: {
        updated,
      },
    });
  } else {
  }
});

const appDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "admin",
  database: "onetomany",
  entities: ["src/entities/*{.ts,.js}"],
  synchronize: true,
  logging: true,
});

appDataSource
  .initialize()
  .then(() => {
    console.log("Connection to database is established");
    app.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
