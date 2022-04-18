module.exports.handle = error => {

   switch (error.message) {
      case 'No data in request body':
         return {status: 400, message: error.message};
      default:
         console.log(error);
         return {status: 400, message: 'Server error'};
   }

}