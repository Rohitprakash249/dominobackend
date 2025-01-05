const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./.env" });
const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

//mongoose.connect returns promise thats why we used .then

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log("DB connection successful!");
  });

const port = process.env.PORT || 8080;


app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
