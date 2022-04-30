import fetch from 'node-fetch';


export const convertToUsd = async (currency, amount) => {

   const response = await fetch('https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11', {
      method: 'GET',
   });

   const exchangeRate = await response.json();

   switch (currency) {
      case 'BTC':
         return amount * parseFloat(exchangeRate[3].sale);
      case 'UAH':
         return amount / parseFloat(exchangeRate[0].sale);
      default:
         throw new Error('Incorrect currency');
   }

}


export const convertToUah = async (currency, amount) => {

   const response = await fetch('https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11', {
      method: 'GET',
   });

   const exchangeRate = await response.json();

   switch (currency) {
      case 'USD':
         return amount * parseFloat(exchangeRate[0].sale);
      case 'EUR':
         return amount * parseFloat(exchangeRate[1].sale);
      default:
         throw new Error('Incorrect currency');
   }

}