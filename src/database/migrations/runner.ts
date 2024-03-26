import "dotenv/config";
import { databaseConfiguration } from "../../config/database";
import { DataSource } from "typeorm";

const appDataSource = new DataSource({
  ...databaseConfiguration() as any,
  migrations: [__dirname + "/*.js"],
  logging: true
});

const args = process.argv.slice(2);
const isReverting = args[0] == "revert";

appDataSource.initialize()
.then(() => {
  return new Promise((resolve, reject) => {
    if( isReverting ) appDataSource.undoLastMigration().then(resolve).catch(reject);
    else appDataSource.runMigrations().then(() => resolve(void 0)).catch(reject);
  })
})
.then(() => process.exit(0))
.catch(err => {
  process.exit(1)
})