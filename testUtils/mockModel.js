/**
 * Lightweight in-memory stand-in for a Mongoose model, used to test
 * route/middleware/controller logic without a real MongoDB connection.
 * Supports the subset of the Mongoose API our auth code actually uses:
 * findOne (incl. $gt), create, and document.save().
 */
function matchesQuery(doc, query) {
  return Object.entries(query).every(([key, condition]) => {
    if (condition && typeof condition === "object" && "$gt" in condition) {
      return doc[key] && doc[key] > condition.$gt;
    }
    return doc[key] === condition;
  });
}

function createMockModel(seedDocs = []) {
  const store = [...seedDocs];
  let idCounter = 1;

  function attachInstanceMethods(doc) {
    doc.id = doc._id;
    doc.save = jest.fn(async () => doc);
    return doc;
  }

  const Model = {
    findOne: jest.fn(async (query) => {
      const found = store.find((d) => matchesQuery(d, query));
      return found ? attachInstanceMethods(found) : null;
    }),
    findById: jest.fn(async (id) => {
      const found = store.find((d) => d._id === id);
      return found ? attachInstanceMethods(found) : null;
    }),
    create: jest.fn(async (data) => {
      const doc = { _id: `mock_id_${idCounter++}`, ...data };
      store.push(doc);
      return attachInstanceMethods(doc);
    }),
    __store: store,
    __reset(newSeed = []) {
      store.length = 0;
      store.push(...newSeed);
      idCounter = 1;
    },
  };

  return Model;
}

module.exports = { createMockModel };
