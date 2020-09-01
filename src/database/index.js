import mongoose from 'mongoose';

class Database {
  constructor() {
    this.mongo();
  }

  mongo() {
    console.log(`Trying to connect in mongodb...`);
    this.connection = mongoose.connect(
      // Change this connection string according to the environment

      // 'mongodb://localhost:27017/integration-expert',
      'mongodb+srv://dbUser:EoQIejQrgECp5Clt@cluster0.erdci.mongodb.net/integration-expert?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useFindAndModify: false,
      }
    );
    console.log(`Connected in mongodb!`);
  }
}

export default new Database();
