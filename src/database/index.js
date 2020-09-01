import mongoose from 'mongoose';

class Database {
  constructor() {
    this.mongo();
  }

  mongo() {
    this.connection = mongoose.connect(
      'mongodb://localhost:27017/integration-expert',
      {
        useNewUrlParser: true,
        useFindAndModify: false,
      }
    );
  }
}

export default new Database();
