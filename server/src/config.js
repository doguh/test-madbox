module.exports = {
  port: process.env.PORT || 3001,
  db: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/testmadboxhugo',
    name: process.env.DB_NAME || 'testmadboxhugo',
  },
};
