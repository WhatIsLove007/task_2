export const validateFields = fields => {

   fields.forEach(field => {
      if (!(field || field === null || field === 0)) {
         throw new Error(`No data in request body`);
      }
   });

}