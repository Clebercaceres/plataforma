const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Asegurarse de que el directorio data existe
const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Asegurarse de que el archivo y directorio existen
const ensureFile = async () => {
  try {
    // Primero asegurarse de que el directorio existe
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }

    // Luego verificar el archivo
    try {
      await fs.access(USERS_FILE);
    } catch {
      await fs.writeFile(USERS_FILE, '[]', { encoding: 'utf8', flag: 'w' });
    }
  } catch (error) {
    console.error('Error al asegurar archivo de usuarios:', error);
    throw new Error('Error al inicializar el sistema de usuarios');
  }
};

// Leer usuarios
const getUsers = async () => {
  await ensureFile();
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    try {
      return JSON.parse(data);
    } catch (parseError) {
      console.error('Error al parsear archivo de usuarios:', parseError);
      // Si el archivo está corrupto, hacer backup y crear nuevo
      const backupFile = `${USERS_FILE}.backup.${Date.now()}`;
      await fs.copyFile(USERS_FILE, backupFile);
      await fs.writeFile(USERS_FILE, '[]', { encoding: 'utf8', flag: 'w' });
      return [];
    }
  } catch (error) {
    console.error('Error al leer archivo de usuarios:', error);
    throw new Error('Error al acceder a los datos de usuarios');
  }
};

// Guardar usuarios
const saveUsers = async (users) => {
  try {
    // Primero escribir a un archivo temporal
    const tempFile = `${USERS_FILE}.temp`;
    await fs.writeFile(tempFile, JSON.stringify(users, null, 2), { encoding: 'utf8', flag: 'w' });
    
    // Hacer backup del archivo actual si existe
    try {
      await fs.access(USERS_FILE);
      const backupFile = `${USERS_FILE}.backup`;
      await fs.copyFile(USERS_FILE, backupFile);
    } catch {}

    // Renombrar el archivo temporal al archivo final
    await fs.rename(tempFile, USERS_FILE);
  } catch (error) {
    console.error('Error al guardar usuarios:', error);
    throw new Error('Error al guardar los datos de usuarios');
  }
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
