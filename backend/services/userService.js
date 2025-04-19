const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const USERS_FILE = path.join(__dirname, '../data/users.json');

// Asegurarse de que el archivo existe
const ensureFile = async () => {
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, '[]');
  }
};

// Leer usuarios
const getUsers = async () => {
  await ensureFile();
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(USERS_FILE, JSON.stringify([]));
      return [];
    }
    throw error;
  }
};

// Guardar usuarios
const saveUsers = async (users) => {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
};

// Agregar usuario
const addUser = async (userData) => {
  const users = await getUsers();
  const newUser = {
    _id: uuidv4(),
    ...userData,
    registrationDate: new Date().toISOString(),
    preferences: null,
    hasFirstPurchase: false
  };
  users.push(newUser);
  await saveUsers(users);
  return newUser;
};

// Verificar credenciales
const verifyCredentials = async (email, password) => {
  const users = await getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    return {
      ...user,
      password: undefined
    };
  }
  return null;
};

// Buscar usuario por email
const findUserByEmail = async (email) => {
  const users = await getUsers();
  const user = users.find(user => user.email === email);
  return user ? { ...user, password: undefined } : null;
};

// Buscar usuario por id
const findUserById = async (userId) => {
  const users = await getUsers();
  return users.find(user => user._id === userId);
};

// Actualizar preferencias del usuario
const updateUserPreferences = async (userId, preferences) => {
  const users = await getUsers();
  const userIndex = users.findIndex(user => user._id === userId);
  
  if (userIndex === -1) {
    throw new Error(`Usuario con ID ${userId} no encontrado`);
  }

  users[userIndex].preferences = preferences;
  await saveUsers(users);
  
  const updatedUser = users[userIndex];
  return {
    ...updatedUser,
    password: undefined
  };
};

// Marcar primera compra realizada
const markFirstPurchase = async (userId) => {
  const users = await getUsers();
  const userIndex = users.findIndex(user => user._id === userId);
  
  if (userIndex === -1) {
    throw new Error('Usuario no encontrado');
  }

  users[userIndex].hasFirstPurchase = true;
  await saveUsers(users);
  return { ...users[userIndex], password: undefined };
};

module.exports = {
  getUsers,
  addUser,
  findUserByEmail,
  findUserById,
  verifyCredentials,
  updateUserPreferences,
  markFirstPurchase
};
