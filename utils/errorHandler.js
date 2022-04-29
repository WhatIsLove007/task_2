export const handle = (error, response) => {

   switch (error.name) {
      case 'SequelizeForeignKeyConstraintError':
         return response.status(403).send({message: 'Cannot delete or update a parent element'});
         break;
      case 'SequelizeValidationError':
         return response.status(403).send({message: 'Wrong data'});
         break;
   }

   switch (error.message) {
      case 'No data in request body':
         return response.status(400).send({message: error.message});
         break;
      default:
         console.log(error);
         return response.status(500).send({message: 'Server error'});
         break;
   }

}