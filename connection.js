// Basado en codigo de AAPABLAZA que se basó en código de Orionx.io
// https://orionx.io/developers/tutorials/consulta-basica-api

/**
 * FullQuery() execs queries to an url with a query body, apiKey and secretKey.
 * @param {String} url Url of the Orionx.io API GraphQL
 * @param {String} pair Pair of the market you want to get
 * @return {Object} JS object
 */
async function fullQuery(url,pair) {
  
  // query
  var query = {
      query: `query ObtieneProfundidad($pair: ID = "") {
      market(code: $pair){
        lastTrade{
          price
        }
      }
      marketOrderBook(marketCode: $pair, limit: 250) {
        sell {
          amount
          limitPrice
          accumulated
          accumulatedPrice
        }
        buy {
          amount
          limitPrice
          accumulated
          accumulatedPrice
        }
      }  
    }`
  };
  
  // variables
  query.variables = `{
      "pair": "`+pair+`"
  }`
  
  //-------------------------- genero firma requerida por la api de orionx ---------------------
  const JSSHA = require('jssha')
  const fetch = require('node-fetch')
  
  // New actual Time-Stamp
  var timeStamp = new Date().getTime() / 1000
  
  // Creating SHA-OBJ
  const shaObj = new JSSHA('SHA-512', 'TEXT')
  
  // Operating info of shaObj
  shaObj.setHMACKey(process.env.ORIONX_API_SECRET_KEY, 'TEXT')
  var body = JSON.stringify(query)
  shaObj.update(timeStamp + body)
  var signature = shaObj.getHMAC('HEX')
  //-------------------------- -------------------------------------------- ---------------------
  
  // Sending request
  try {
    let res = await fetch(url, {            // Consulta tipo POST.
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ORIONX-TIMESTAMP': timeStamp,
        'X-ORIONX-APIKEY': process.env.ORIONX_API_KEY,
        'X-ORIONX-SIGNATURE': signature,
        'Content-Length': body.length,
      },
      body,                                 // Cuerpo del Mensaje (query)
    })
    return res.json()
  } catch (e) {
    throw(e)
  }
}

/**
 * main() prints the result of a GraphQL query to Orionx.io
 * @param {String} pair Pair of the market you want to get
 */
async function main(pair) {
  try {
    let res = await fullQuery('http://api2.orionx.io/graphql',pair)

    if(res.data) {
      // ok
    }
    else {
      console.log('resdata vacio')
    }
    
    return res.data
    
  } catch (e) {
    console.log('error algo paso')
    throw(e)
  }
}

module.exports = {
  consulta: function (pair) {
    return main(pair)
  }
}