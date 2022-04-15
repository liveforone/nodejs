let http = require('http');
let fs = require('fs');
let url = require("url");

let app = http.createServer((request,response) => {
    let _url = request.url;
    let queryData = new URL("http://localhost:3000" + _url).searchParams;
    let pathname = new URL("http://localhost:3000" + _url).pathname;
    
    if  (pathname === "/") {

      if (queryData.get("id") === null) {

        fs.readdir("./data", (err, fileList) => {

          let title = "welcome";
          let discription = "hello, Node.js";

          let list = "<ul>";
          let i = 0;
          while (i < fileList.length) {
            list += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
            i += 1;
          }
          list = list + "</ul>";

          /*
          <ul>
            <li><a href="/?id=HTML">HTML</a></li>
            <li><a href="/?id=CSS">CSS</a></li>
            <li><a href="/?id=JavaScript">JavaScript</a></li>
          </ul>
          */

          let template = `<!doctype html>
          <html>
            <head>
            <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
              ${list}
              <h2>${title}</h2>
              <p>${discription}</p>
            </body>
          </html>`;

          response.writeHead(200);
          response.end(template);
        });
      } else {

        fs.readdir('./data', (error, fileList) => {

          let title = 'Welcome';
          let description = 'Hello, Node.js';

          let list = '<ul>';
          let i = 0;
          while(i < fileList.length) {
            list += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
            i += 1;
          }
          list = list+'</ul>';

          fs.readFile(`data/${queryData.get("id")}`, 'utf8', (err, description) => {
            
            let title = queryData.get("id");
            let template = `
            <!doctype html>
            <html>
            <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
              ${list}
              <h2>${title}</h2>
              <p>${description}</p>
            </body>
            </html>`;
            response.writeHead(200);
            response.end(template);
          });
        });
      }
    } else {

      response.writeHead(404);
      response.end("Not found");
    }    
});
app.listen(3000);