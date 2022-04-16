const Car = require('../models/products/Car')

module.exports.addCar = async (request, response) => {

   const {name, country, category} = request.body;
   const price = parseInt(request.body.price);

   if (!name || !country || !price || !category) {
      return response.status(400).send({message: 'No data in request body'});
   }

   try {
      const existingProduct = await Car.findOne({where: {name}});

      if (existingProduct) return response.status(409).send({message: 'Product exists'});

      await Car.create({name, country, price, category});

      response.sendStatus(200);
      
   } catch (error) {
      console.log(error);
      response.status(500).send({message: 'Server error'});
   }

}


module.exports.removeCar = async (request, response) => {

   const { productName } = request.query;
   if (!productName) return response.status(400).send({message: 'No data in request body'})

   try {
      const existingProduct = await Car.destroy({where: {name: productName}});
      if (!existingProduct) return response.status(404).send({message: 'Product doen not exist'});
      response.sendStatus(200);
      
   } catch (error) {
      console.log(error);
      response.status(500).send({message: 'Server error'});
   }

}