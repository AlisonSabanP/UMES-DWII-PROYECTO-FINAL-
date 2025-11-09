import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import { User, Game } from './models/index.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ARCADESTORE API está corriendo!' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@arcadestore.com' });
    if (!adminExists) {
      const adminUser = new User({
        fullName: 'Administrator',
        email: 'admin@arcadestore.com',
        password: 'admin123',
        role: 'admin'
      });
      await adminUser.save();
      console.log('Usuario Admin Creado exitosamente');
      console.log('Email: admin@arcadestore.com');
      console.log('Password: admin123');
    }
  } catch (error) {
    console.error('Error creando usuario Admin:', error);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    await createAdminUser();
    await seedDefaultGames();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);              
    process.exit(1);
  }
};

startServer();

async function seedDefaultGames() {
  try {
    const adminEmail = 'admin@arcadestore.com';
    const admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      console.warn('No se encontró el usuario administrador. Creando administrador primero....');
      await createAdminUser();
    }
    const adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      console.error('Error creando/encotrando el usuario administrador. Saltando envío de juegos default.');
      return;
    }

    const defaults = [
      {
        query: { gameType: 'balloon-pop' },
        data: {
          name: 'Balloon Pop',
          description: 'Explota globos para ganar puntos. ¡No los dejes escapar!',
          price: 0,
          category: 'arcade',
          icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Red_balloon_icon.png/240px-Red_balloon_icon.png',
          gameType: 'balloon-pop',
          isActive: true,
          createdBy: adminUser._id,
        },
      },
      {
        query: { gameType: 'puzzle' },
        data: {
          name: 'Puzzle',
          description: 'Organiza fichas para completar el rompecabezas lo más rápido que puedas.',
          price: 80.00,
          category: 'puzzle',
          icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Jigsaw_puzzle_piece_icon.svg/240px-Jigsaw_puzzle_piece_icon.svg.png',
          gameType: 'puzzle',
          isActive: true,
          createdBy: adminUser._id,
        },
      },
    ];

    for (const def of defaults) {
      const exists = await Game.findOne(def.query);
      if (!exists) {
        const game = new Game(def.data);
        await game.save();
        console.log(`Juego default enviado: ${def.data.name}`);
      } else if (!exists.icon || exists.icon.trim() === '') {
        exists.icon = def.data.icon;
        await exists.save();
        console.log(`Icono actualizado para juego: ${exists.name}`);
      }
    }
  } catch (err) {
    console.error('Error enviando los juegos default:', err);
  }
}
