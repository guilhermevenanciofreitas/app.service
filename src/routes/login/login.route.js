import express from 'express';

class LoginRoute {

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/sign-in', this.getAllProducts);
    this.router.post('/', this.createProduct);
    this.router.get('/:id', this.getProductById);
  }

  getAllProducts(req, res) {
    res.json({ message: 'List of all products' });
  }

  createProduct(req, res) {
    res.json({ message: 'Product created' });
  }

  getProductById(req, res) {
    const { id } = req.params;
    res.json({ message: `Product with ID ${id}` });
  }
}

export const LoginRoute = new LoginRoute().router;