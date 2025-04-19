const products = {
    ff: [
      {
        id: 'ff-1',
        name: 'Paquete 100 Diamantes',
        category: 'diamonds',
        price: 5,
        image: '/images/ff-diamonds-100.jpg'
      },
      {
        id: 'ff-2',
        name: 'Paquete 310 Diamantes',
        category: 'diamonds',
        price: 10,
        image: '/images/ff-diamonds-310.jpg'
      },
      {
        id: 'ff-3',
        name: 'Cuenta Nivel 50',
        category: 'accounts',
        price: 25,
        image: '/images/ff-account-50.jpg'
      },
      {
        id: 'ff-4',
        name: 'AK47 Dragón',
        category: 'weapons',
        price: 15,
        image: '/images/ff-ak47-dragon.jpg'
      },
      {
        id: 'ff-5',
        name: 'Traje Ninja',
        category: 'outfits',
        price: 12,
        image: '/images/ff-ninja-outfit.jpg'
      },
      {
        id: 'ff-6',
        name: 'Mascota Dragón',
        category: 'special',
        price: 20,
        image: '/images/ff-dragon-pet.jpg'
      }
    ],
    cod: [
      {
        id: 'cod-1',
        name: 'Paquete 80 CP',
        category: 'diamonds',
        price: 5,
        image: '/images/cod-cp-80.jpg'
      },
      {
        id: 'cod-2',
        name: 'Paquete 400 CP',
        category: 'diamonds',
        price: 10,
        image: '/images/cod-cp-400.jpg'
      },
      {
        id: 'cod-3',
        name: 'Cuenta Prestigio',
        category: 'accounts',
        price: 30,
        image: '/images/cod-account-prestige.jpg'
      },
      {
        id: 'cod-4',
        name: 'M4 Legendaria',
        category: 'weapons',
        price: 20,
        image: '/images/cod-m4-legendary.jpg'
      },
      {
        id: 'cod-5',
        name: 'Traje Fantasma',
        category: 'outfits',
        price: 15,
        image: '/images/cod-ghost-outfit.jpg'
      },
      {
        id: 'cod-6',
        name: 'Amuleto Legendario',
        category: 'special',
        price: 10,
        image: '/images/cod-legendary-charm.jpg'
      }
    ]
  };
  
  const getProductsByGame = (game) => {
    return products[game] || [];
  };
  
  module.exports = {
    getProductsByGame
  };
  