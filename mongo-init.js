// mongo-init.js — runs once on first container startup
// Creates the zulugshop database and a dedicated app user
// Only used in local Docker Compose (Atlas manages this in production)

db = db.getSiblingDB('zulugshop');

db.createUser({
  user: 'zulugshop_user',
  pwd: 'zulugshop_pass',
  roles: [{ role: 'readWrite', db: 'zulugshop' }]
});

// Create indexes for common queries
db.products.createIndex({ name: 'text', description: 'text' });
db.products.createIndex({ categoryId: 1, active: 1 });
db.products.createIndex({ featured: 1, active: 1 });
db.orders.createIndex({ userId: 1, createdAt: -1 });
db.orders.createIndex({ status: 1 });
db.users.createIndex({ email: 1 }, { unique: true });

print('ZuluGshop database initialized with indexes.');
