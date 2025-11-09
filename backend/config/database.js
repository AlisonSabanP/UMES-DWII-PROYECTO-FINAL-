import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI no está definida en las variables de entorno');
  }

  try {
    const conn = await mongoose.connect(uri);

    console.log(`MongoDB Conectado: ${conn.connection.host}:${conn.connection.port}`);    

    const collections = ['users', 'games', 'purchases', 'scores'];
    const existingCollections = await mongoose.connection.db.listCollections().toArray();
    const existingNames = existingCollections.map(col => col.name);

    for (const collection of collections) {
      if (!existingNames.includes(collection)) {
        await mongoose.connection.db.createCollection(collection);
        console.log(`Colección creada: ${collection}`);
      }
    }
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error);
    process.exit(1);
  }
};

export default connectDB;