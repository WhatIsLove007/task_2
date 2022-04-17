module.exports.validateFields = (fields, response) => {

      fields?.forEach(field => {
         if (!field) {
            throw new Error(`No data in request body`);
         }
      });

}