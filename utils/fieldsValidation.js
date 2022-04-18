module.exports.validateFields = (fields) => {

      fields?.forEach(field => {
         if (!field) {
            throw new Error(`No data in request body`);
         }
      });

}