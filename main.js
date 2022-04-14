let http = require('http');
let fs = require('fs');
let url = require("url");
let app = http.createServer(function(request,response){
    let _url = request.url;
    let queryData = new URL("http://localhost:3000" + _url).searchParams;
    let title = queryData.get("id");
    console.log(queryData.get("id"));
    if(_url == '/'){
        title = "Wellcome!"
    }
    if(_url == '/favicon.ico'){
        response.writeHead(404);
        response.end();
        return;
    }
    response.writeHead(200);
    fs.readFile(`data/${title}`, "utf8", (err, discription) => {
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
      response.end(template);
    });
});
app.listen(3000);