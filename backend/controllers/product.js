const uuid = require('uuid/v1');
const Product = require('../models/Product');

exports.getAllProducts = (req, res, next) => {
  Product.find().then(
    (products) => {
      const mappedProducts = products.map((product) => {
        product.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + product.imageUrl;
        return product;
      });
      res.status(200).json(mappedProducts);
    }
  ).catch(
    () => {
      res.status(500).send(new Error('Database error!'));
    }
  );
};

exports.getOneProduct = (req, res, next) => {
  Product.findById(req.params.id).then(
    (product) => {
      if (!product) {
        return res.status(404).send(new Error('Product not found!'));
      }
      product.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + product.imageUrl;
      res.status(200).json(product);
    }
  ).catch(
    () => {
      res.status(500).send(new Error('Database error!'));
    }
  )
};

/**
 *
 * Expects request to contain:
 * contact: {
 *   firstName: string,
 *   lastName: string,
 *   address: string,
 *   city: string,
 *   email: string
 * }
 * products: [string] <-- array of product _id
 *
 */
exports.orderProducts = (req, res) => {
  for (let key in req.body) {
    if (key !== 'products' && key !== 'contact') {
      return res.status(403).json({ message: 'Unexpected form' })
    }
  }

  const contact = req.body.contact
  for (let key in contact) {
    if (key !== 'firstName' && key !== 'lastName' && key !== 'address' && key !== 'city' && key !== 'email') {
      return res.status(403).json({ message: 'Unexpected form' })
    }
  }

  if (
    !req.body.contact ||
    !req.body.contact.firstName ||
    !req.body.contact.lastName ||
    !req.body.contact.address ||
    !req.body.contact.city ||
    !req.body.contact.email ||
    !req.body.products || req.body.products.length === 0 || req.body.products.length > 8) {
    return res.status(403).json({ message: 'Unexpected form' })
  }

  let numberOfEach = 0
  let productChosenMoreThanOnce = []

  for (let each of req.body.products) {
    let index = 0
    let i = req.body.products[index]

    while (index !== req.body.products.length) {
      if (i === each) {
        numberOfEach++
      }

      index++
      i = req.body.products[index]
    }

    if (numberOfEach > 1 && !productChosenMoreThanOnce.includes(each)) {
      productChosenMoreThanOnce.push(each)
    }
    numberOfEach = 0
  }

  let productsControl = []
  for (let each of req.body.products) {
    if (/^([a-z0-9\.-]{1,32})$/.test(each)) {
      productsControl.push(true)
    }
    else {
      productsControl.push(false)
    }
  }

  if (
    !/^([^0-9\s-<>≤≥«»© ↓¬,?¿;.×:/÷!§¡%´*`€^¨$£²¹&~"#'{(|`_@°=+)}\[\]\\]{2,15})([-\s]{1}[^0-9\s-<>≤≥«»© ↓¬,?¿;.×:/÷!§¡%´*`€^¨$£²¹&~"#'{(|`_@°=+)}\[\]\\]{2,15}){0,2}$/.test(req.body.contact.firstName) ||
    !/^([^0-9\s-<>≤≥«»© ↓¬,?¿;.×:/÷!§¡%´*`€^¨$£²¹&~"#'{(|`_@°=+)}\[\]\\]{1,15})([-\s']{1}[^0-9\s-<>≤≥«»© ↓¬,?¿;.×:/÷!§¡%´*`€^¨$£²¹&~"#'{(|`_@°=+)}\[\]\\]{1,15}){0,3}$/.test(req.body.contact.lastName) ||
    !/^([0-9]{0,4})([-\s]{0,1}[^0-9\s-<>≤≥«»© ↓¬,?¿;.×:/÷!§¡%´*`€^¨$£²¹&~"#'{(|`_@°=+)}\[\]\\]{2,15}){0,1}([-\s']{1}[^0-9\s-<>≤≥«»© ↓¬,?¿;.×:/÷!§¡%´*`€^¨$£²¹&~"#'{(|`_@°=+)}\[\]\\]{1,15}){1,8}$/.test(req.body.contact.address) ||
    !/^([^0-9\s-<>≤≥«»© ↓¬,?¿;.×:/÷!§¡%´*`€^¨$£²¹&~"#'{(|`_@°=+)}\[\]\\]{1,15})([-\s']{1}[^0-9\s-<>≤≥«»© ↓¬,?¿;.×:/÷!§¡%´*`€^¨$£²¹&~"#'{(|`_@°=+)}\[\]\\]{1,15}){0,6}$/.test(req.body.contact.city) ||
    !/^([a-z0-9\.-]{1,20})@([a-z]{1,8})\.([a-z]{2,3})$/.test(req.body.contact.email) ||
    productsControl.includes(false) ||
    productChosenMoreThanOnce.length !== 0) {
    return res.status(401).json({ message: 'Unexpected form' })
  }

  let queries = [];
  for (let productId of req.body.products) {
    const queryPromise = new Promise((resolve, reject) => {
      Product.findById(productId).then(
        (product) => {
          if (!product) {
            reject('Product not found: ' + productId);
          }
          product.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + product.imageUrl;
          resolve(product);
        }
      ).catch(
        () => {
          reject('Database error!');
        }
      )
    });
    queries.push(queryPromise);
  }
  Promise.all(queries).then(
    (products) => {
      const orderId = uuid();
      return res.status(201).json({
        orderId: orderId
      })
    }
  ).catch(
    (error) => {
      return res.status(500).json(new Error(error));
    }
  );
};
