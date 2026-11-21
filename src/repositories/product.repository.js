const initial = [
  { id: 1, name: 'Laptop Pro', price: 1200.50, stock: 15 },
  { id: 2, name: 'Souris Sans Fil', price: 25.99, stock: 50 },
  { id: 3, name: 'Clavier Mécanique', price: 75, stock: 30 }
];
// Compteur monotone : un identifiant supprimé n'est pas réutilisé avant redémarrage.
let products = initial.map(p => ({ ...p }));
let nextId = 4;
export const productRepository = {
  findAll: async () => products.map(p => ({ ...p })),
  findById: async id => { const p = products.find(p => p.id === id); return p && { ...p }; },
  create: async data => { const p = { ...data, id: nextId++ }; products.push(p); return { ...p }; },
  update: async (id, data) => {
    const i = products.findIndex(p => p.id === id);
    if (i === -1) return null;
    products[i] = { ...data, id };
    return { ...products[i] };
  },
  delete: async id => {
    const i = products.findIndex(p => p.id === id);
    if (i === -1) return false;
    products.splice(i, 1); return true;
  }
};
