import { productService as service } from '../services/product.service.js';
const handle = fn => async (req, res, next) => { try { await fn(req, res); } catch (error) { next(error); } };
export const productController = {
  getAll: handle(async (req, res) => { const data = await service.getAllProducts(); res.json({ success: true, count: data.length, data }); }),
  getById: handle(async (req, res) => res.json({ success: true, data: await service.getProductById(Number(req.params.id)) })),
  create: handle(async (req, res) => {
    const data = await service.createProduct(req.body);
    res.location(`/api/products/${data.id}`).status(201).json({ success: true, message: 'Produit créé avec succès', data });
  }),
  update: handle(async (req, res) => res.json({ success: true, message: 'Produit mis à jour avec succès', data: await service.updateProduct(Number(req.params.id), req.body) })),
  patch: handle(async (req, res) => res.json({ success: true, message: 'Produit modifié partiellement avec succès', data: await service.patchProduct(Number(req.params.id), req.body) })),
  remove: handle(async (req, res) => { await service.deleteProduct(Number(req.params.id)); res.status(204).send(); })
};
