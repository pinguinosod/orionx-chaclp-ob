// requiring the HTTP interfaces in node 
var http = require('http')

var orionx_conn = require('./connection.js')


// create an http server to handle requests and response 
http.createServer(function (req, res) { 
    //log the request:
    console.log('New request from: '+req.headers.referer);
    
    // sending a response header of 200 OK 
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    
    async function consultaOrionx() {
        try {
            var resultado_final = await orionx_conn.consulta()
            if (resultado_final) {
                res.write(JSON.stringify(resultado_final), function(err) { res.end() })
            }
            else{
                console.log('resultado vacio')
                res.write(JSON.stringify({}), function(err) { res.end() })
            }
            res.end()
        } catch (e) {
            console.log(e);   // uncaught
            res.end()
        }
    }
    
    consultaOrionx()
    
    // use port 8081
}).listen(8081)
console.log('Server running on port 8081.')