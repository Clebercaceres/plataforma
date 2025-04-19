const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const ORDERS_FILE = path.join(__dirname, '../data/orders.json');

const getOrders = async () => {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(ORDERS_FILE, JSON.stringify([]));
      return [];
    }
    throw error;
  }
};

const saveOrders = async (orders) => {
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
};

const createOrder = async (orderData) => {
  const orders = await getOrders();
  const newOrder = {
    id: uuidv4(),
    ...orderData,
    createdAt: new Date().toISOString(),
    status: 'completed'
  };
  
  orders.push(newOrder);
  await saveOrders(orders);
  return newOrder;
};

const getUserOrders = async (userId) => {
  const orders = await getOrders();
  return orders.filter(order => order.userId === userId);
};

module.exports = {
  createOrder,
  getUserOrders
};
