const http = require('http');
const axios = require('axios');
const fs = require("fs");
const url = require("url");

const port = 8081;
const host = 'localhost';

const cliente= 'https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json';
const proveedor = 'https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json';
const htmlo="index.html";

function change(nombres, nombreplural, url,  callback) {
// Make a request for a user with a given ID
axios.get(url)
  .then(function (response) {
    // handle success
    
   
    fs.readFile(htmlo, "utf8", (err, data) => {
        if (err) {
          console.error(err);
        } else {
          let text = data.toString();
          text = text.replace(/{{title}}/g, nombreplural);
          let rows = "";
          response.data.forEach(element => {
            console.log(element);
            rows += `\t\t<tr>\n \
                        \t\t\t<th scope="row">${element[nombres[0]]}</th> \n\
                        \t\t\t<td>${element[nombres[1]]}</td> \n\
                        \t\t\t<td>${element[nombres[2]]}</td> \n\
                        \t\t</tr> \n`;
        });
          text = text.replace(/{{body}}/g, rows);
          callback(text);
        }
      });

  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });
}


// Now that server is running
http.createServer((req, res) => {
    let pathname = url.parse(req.url).pathname;
    
    
    if (pathname == "/api/clientes") {
      
      change(["idCliente", "NombreCompania","NombreContacto" ], "clientes", cliente, (data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data.toString());
      });
    } else if (pathname == "/api/proveedores") {
      
      change(["idproveedor","nombrecompania","nombrecontacto"],"proveedores",proveedor, (data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data.toString());
      });
    }

}).listen(port);