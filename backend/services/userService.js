const fs = require('fs').promises;
const path = require('path');

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
  const data = await fs.readFile(USERS_FILE, 'utf8');
  return JSON.parse(data);
};

// Guardar usuarios
const saveUsers = async (users) => {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
};

// Agregar usuario
const addUser = async (userData) => {
  const users = await getUsers();
  const newUser = {
    _id: Date.now().toString(),
    ...userData,
    registrationDate: new Date().toISOString()
  };
  users.push(newUser);
  await saveUsers(users);
  return newUser;
};

// Buscar usuario por email
const findUserByEmail = async (email) => {
  const users = await getUsers();
  return users.find(user => user.email === email);
};

module.exports = {
  getUsers,
  addUser,
  findUserByEmail
};
