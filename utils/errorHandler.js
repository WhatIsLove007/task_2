export const handle = (error, response) => {

   switch (error.message) {
      case 'No data in request body':
         response.status(400).send({message: error.message});
         break;
      default:
         console.log(error);
         response.status(500).send({message: 'Server error'});
   }

}