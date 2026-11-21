import { productRepository as repo } from '../repositories/product.repository.js';
import { Product } from '../models/product.model.js';
const validate = data => {
  try { return new Product(data.name, data.price, data.stock); }
  catch (error) { error.status = 400; throw error; }
};
export const productService = {
  getAllProducts: () => repo.findAll(),
  getProductById: async id => {
    const p = await repo.findById(id);
    if (!p) throw Object.assign(new Error('Produit non trouvé'), { status: 404 });
    return p;
  },
  createProduct: data => repo.create(validate(data)),
  updateProduct: async (id, data) => {
    await productService.getProductById(id);
    return repo.update(id, validate(data));
  },
  patchProduct: async (id, data) => {
    const existing = await productService.getProductById(id);
    for (const field of ['name', 'price', 'stock']) {
      if (Object.hasOwn(data, field)) existing[field] = data[field];
    }
    return productService.updateProduct(id, existing);
  },
  deleteProduct: async id => {
    await productService.getProductById(id);
    return repo.delete(id);
  }
};
