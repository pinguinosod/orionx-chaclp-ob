// Basado en codigo de AAPABLAZA que se basó en código de Orionx.io
// https://orionx.io/developers/tutorials/consulta-basica-api

const JSSHA = require('jssha')
const fetch = require('node-fetch')

// query
var query = {                        
    query: `{
    market(code: "CHACLP"){
      lastTrade{
        price
      }
    }
    marketOrderBook(marketCode: "CHACLP", limit: 250) {
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

// New actual Time-Stamp
var timeStamp = new Date().getTime() / 1000

// Creating SHA-OBJ
const shaObj = new JSSHA('SHA-512', 'TEXT')

// Operating info of shaObj
shaObj.setHMACKey(process.env.ORIONX_API_SECRET_KEY, 'TEXT')
var body = JSON.stringify(query)
shaObj.update(timeStamp + body)
var signature = shaObj.getHMAC('HEX')

/**
 * FullQuery() execs queries to an url with a query body, apiKey and secretKey.
 * @param {String} url Url of the Orionx.io API GraphQL
 * @return {Object} JS object
 */
async function fullQuery(url) {
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
 * @param {String} query GraphQL query string
 */
async function main(query) {
  try {
    let res = await fullQuery('http://api2.orionx.io/graphql')

    //console.log('*** Response ***');    // Se imprime la respuesta que llega
    //console.log(res.data);
    if(res.data) {
      
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
  consulta: function () {
    return main(query)
  }
}