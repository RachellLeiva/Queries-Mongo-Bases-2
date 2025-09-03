use("Ferreteria");

db.Productos.drop();

db.createCollection("Productos", { 
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["sku", "nombre", "categoria", "precio", "stock", "creadoEn"],
      properties: {
        sku: {
          bsonType: "string",
          description: "Identificador de producto",
          pattern: "^P\\d{3,5}$",
          minLength: 4,
          maxLength: 6
        },
        nombre: {
          bsonType: "string",
          description: "Nombre del producto",
          minLength: 3,
          maxLength: 120
        },
        categoria: {
          bsonType: "string",
          description: "Categoría del producto",
          enum: [
            "Herramientas",
            "Eléctricas",
            "Seguridad",
            "Pinturas",
            "Fijaciones",
            "Construcción",
            "Jardinería"
          ]
        },
        precio: {
          bsonType: ["int", "long", "double", "decimal"],
          description: "Precio en moneda local (CRC)",
          minimum: 0
        },
        stock: {
          bsonType: ["int", "long"],
          description: "Unidades en inventario (no negativo)",
          minimum: 0
        },
        creadoEn: {
          bsonType: "date",
          description: "Fecha de creación del registro"
        },
        descripcion: {
          bsonType: "string",
          description: "Descripción breve",
          maxLength: 500
        },
        marca: {
          bsonType: "string",
          description: "Marca del producto",
          maxLength: 60
        },
        tags: {
          bsonType: "array",
          description: "Etiquetas (únicas, strings no vacías)",
          uniqueItems: true,
          items: { bsonType: "string", minLength: 1, maxLength: 30 }
        },
        proveedor: {
          bsonType: "object",
          required: ["nombre"],
          properties: {
            nombre: { bsonType: "string", minLength: 2, maxLength: 80 },
            telefono: {
              bsonType: "string",
              pattern: "^[+0-9\\s-]{7,20}$"
            },
            email: {
              bsonType: "string",
              pattern: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$"
            }
          },
          additionalProperties: true
        }
      },
      additionalProperties: true
    }
  },
  validationAction: "error",
  validationLevel: "strict"
});

db.Productos.insertMany([
  { sku:"P001", nombre:"Martillo Pro Acero", categoria:"Herramientas", precio:7500, stock:20, creadoEn:ISODate("2025-03-01T10:00:00Z") },
  { sku:"P002", nombre:"Destornillador Phillips #2", categoria:"Herramientas", precio:2500, stock:60, creadoEn:ISODate("2025-03-02T11:00:00Z") },
  { sku:"P003", nombre:"Llave Inglesa 10\"", categoria:"Herramientas", precio:5200, stock:35, creadoEn:ISODate("2025-03-03T09:00:00Z") },
  { sku:"P004", nombre:"Taladro Inalámbrico 18V", categoria:"Eléctricas", precio:45000, stock:8, creadoEn:ISODate("2025-03-04T12:00:00Z") },
  { sku:"P005", nombre:"Brocas para Metal (Juego 13p)", categoria:"Eléctricas", precio:9800, stock:15, creadoEn:ISODate("2025-03-05T08:30:00Z") },
  { sku:"P006", nombre:"Sierra Circular 7-1/4\"", categoria:"Eléctricas", precio:68500, stock:5, creadoEn:ISODate("2025-03-06T14:00:00Z") },
  { sku:"P007", nombre:"Guantes Anticorte Talla L", categoria:"Seguridad", precio:3200, stock:50, creadoEn:ISODate("2025-03-07T10:45:00Z") },
  { sku:"P008", nombre:"Lentes de Seguridad Pro", categoria:"Seguridad", precio:2900, stock:70, creadoEn:ISODate("2025-03-08T13:20:00Z") },
  { sku:"P009", nombre:"Casco de Seguridad Azul", categoria:"Seguridad", precio:8200, stock:18, creadoEn:ISODate("2025-03-09T09:15:00Z") },
  { sku:"P010", nombre:"Pintura Látex Interior Blanca 1 Gal", categoria:"Pinturas", precio:16500, stock:25, creadoEn:ISODate("2025-03-10T15:00:00Z") },
  { sku:"P011", nombre:"Rodillo de Pintura 9\" Antigota", categoria:"Pinturas", precio:4200, stock:40, creadoEn:ISODate("2025-03-11T08:00:00Z") },
  { sku:"P012", nombre:"Brocha 2\" Cerdas Naturales", categoria:"Pinturas", precio:2100, stock:80, creadoEn:ISODate("2025-03-12T17:00:00Z") }

]);

console.log("\n==Find: Todos los productos con solo sku, nombre y precio.");
printjson(
db.Productos.find({},{sku: 1, nombre: 1, precio:1, _id: 0}).toArray());


console.log("\n==Find: Productos con precio mayor a 10,000 CRC ordenados descendentemente.");
printjson(
db.Productos.find({precio: {$gt: 10000}}, {_id: 0}).sort({precio: -1}));


console.log("\n==Find: Productos de la categoría Seguridad o Pinturas.");
printjson(
db.Productos.find({categoria: {$in: ["Seguridad", "Pinturas"]}}, {_id: 0}));


console.log("\n==Find: Productos con stock entre 10 y 30 unidades.");
printjson(
db.Productos.find({stock: {$gte: 10, $lte: 30}}, {_id: 0}));


console.log("\n==Find: Productos cuyo nombre empiece con la letra P, sin importar mayúsculas o minúsculas.");
printjson(
db.Productos.find({nombre: {$regex: /^P/i}}, {_id: 0}));


console.log("\n==Find: Paginación mostrando 5 productos después de saltar 3, ordenados por nombre.");
printjson(
db.Productos.find({}, {_id: 0}).sort({nombre: 1}).skip(3).limit(5));

//Parte B: Updates:

console.log("\n==Update: Cambiar el precio de un producto específico a un nuevo valor.");
// Cambiar el precio del producto con sku "P001" a 8000 CRC
printjson(
db.Productos.updateOne(
  {sku: "P001"},
  {$set: {precio: 8000}}
)
);


console.log("\n==Update: Incrementar el stock de un producto en una cantidad determinada.");
// Incrementar el stock del producto con sku "P002" en 15 unidades
printjson(
db.Productos.updateOne(
  {sku: "P002"},
  {$inc: {stock: 15}}
)
);


console.log("\n==Update: Agregar un nuevo campo tags a un producto con un arreglo de etiquetas.");
// Agregar tags al producto con sku "P003"
printjson(
db.Productos.updateOne(
  {sku: "P003"},
  {$set: {tags: ["herramienta", "ajuste", "mecánica"]}}
)
);


console.log("\n==Update: Normalizar el nombre de un producto.");
// Cambiar 'Llave Inglesa 10"' por 'Llave Ajustable 10 Pulgadas'
printjson(
db.Productos.updateOne(
  {sku: "P003"},
  {$set: {nombre: "Llave Ajustable 10 Pulgadas"}}
)
);


//Parte C:Upsert
console.log("\n==Upsert: Actualizar stock si existe, insertar si no existe.");

// Upsert para el producto con sku "P013"
printjson(
db.Productos.updateOne(
  {sku: "P013"},
  {
    $set: {
      nombre: "Alicate de Punta 8\"",
      categoria: "Herramientas",
      precio: 6800,
      stock: 25,
      creadoEn: new Date(),
      descripcion: "Alicate de punta para trabajos de precisión",
      marca: "HerraPro"
    },
    $setOnInsert: {
      tags: ["herramienta", "precision", "electricidad"],
      proveedor: {
        nombre: "ProveTools SA",
        telefono: "+506 2222-3333",
        email: "ventas@provetools.com"
      }
    }
  },
  {upsert: true}
)
);
// Verificar el resultado
console.log("\n==Verificación del upsert:");
printjson(db.Productos.find({sku: "P013"}, {_id: 0}));


//Parte D:Deletes

console.log("\n==Delete: Eliminar un producto específico por su sku.");
// Eliminar el producto con sku "P012"
printjson(
db.Productos.deleteOne(
  {sku: "P012"}
)
);


console.log("\n==Delete: Eliminar todos los productos con stock menor a 10 unidades.");
// Eliminar productos con stock menor a 10
printjson(
db.Productos.deleteMany(
  {stock: {$lt: 10}}
)
);


console.log("\n==Verificación después de las eliminaciones:");
printjson(db.Productos.find({}, {_id: 0}).sort({sku: 1}).toArray());
