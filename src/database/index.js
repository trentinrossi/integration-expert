import mongoose from 'mongoose';

class Database {
  constructor() {
    this.mongo();
  }

  mongo() {
    this.connection = mongoose.connect(
      // 'mongodb://localhost:27017/integration-expert',
      'mongodb+srv://dbUser:EoQIejQrgECp5Clt@cluster0.tnmfp.mongodb.net/integration-expert?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useFindAndModify: false,
      }
    );
  }
}

export default new Database();
