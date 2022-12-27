import dotenv from 'dotenv';
dotenv.config();

export const createCustomer = (email, description, card, omise) => {
  return new Promise((resolve, reject) => {
    omise.customers.create(
      {
        email,
        description,
        card,
      },
      function (err, res) {
        if (res) {
          resolve(res);
        } else {
          reject(null);
        }
      }
    );
  });
};

export const createCharge = ( amount, customer, omise ) => {
  return new Promise((resolve, reject) => {
    omise.charges.create({
      'amount': (amount*100).toString(),
      'currency': 'thb',
      'customer': customer.id,
    }, function(error, charge) {
      if(charge) {
        resolve(charge);
      }
      else {
        reject(null);
      }
    });
  });
};

export const createInternetBanking = (amount, token, _id) => {
  return new Promise((resolve, reject) => {
    omise.charges.create({
      'amount':     (amount*100).toString(),
      'source':     token,
      'currency':   'thb',
      'return_uri': baseUrl+`/order/${_id}`,
    }, function(error, response) {
      if(response) {
        resolve(response);
      }
      else {
        reject(null);
      }
    });
  });
};