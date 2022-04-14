let http = require('http');
let fs = require('fs');
let url = require("url");
let app = http.createServer(function(request,response){
    let _url = request.url;
    let queryData = new URL("http://localhost:3000" + _url).searchParams;
    let pathname = new URL("http://localhost:3000" + _url).pathname;
    
    if  (pathname === "/") {
      if (queryData.get("id") === null) {
        let title = "welcome";
        let discription = "hello, Node.js";
        let template = `<!doctype html>
        <html>
        <head>
        <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
          </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          <ul>
            <li><a href="/?id=HTML">HTML</a></li>
            <li><a href="/?id=CSS">CSS</a></li>
            <li><a href="/?id=JavaScript">JavaScript</a></li>
          </ul>
        <h2>${title}</h2>
          <p>${discription}</p>
        </body>
        </html>`;
        response.writeHead(200);
        response.end(template);
      } else {
        fs.readFile(`data/${queryData.get("id")}`, "utf8", (err, discription) => {
          let title = queryData.get("id");
          let template = `<!doctype html>
          <html>
          <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
          </head>
          <body>
          <h1><a href="/">WEB</a></h1>
          <ul>
            <li><a href="/?id=HTML">HTML</a></li>
            <li><a href="/?id=CSS">CSS</a></li>
            <li><a href="/?id=JavaScript">JavaScript</a></li>
          </ul>
          <h2>${title}</h2>
          <p>${discription}</p>
          </body>
          </html>`;
          response.writeHead(200);
          response.end(template);
        });
      }
    } else {
      response.writeHead(404);
      response.end("Not found");
    }
    
});
app.listen(3000);