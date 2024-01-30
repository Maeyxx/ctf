db = db.getSiblingDB('maBaseDeDonnees');

function createCollectionIfNotExists(collectionName) {
    var collections = db.getCollectionNames();
    if (!collections.includes(collectionName)) {
        db.createCollection(collectionName);
        print(`Created collection: ${collectionName}`);
    } else {
        print(`Collection ${collectionName} already exists`);
    }
}

createCollectionIfNotExists('ctf');
createCollectionIfNotExists('products');
createCollectionIfNotExists('sales');
createCollectionIfNotExists('users');
createCollectionIfNotExists('users_informations');

print("Initialization of collections completed.");