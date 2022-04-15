let http = require('http');
let fs = require('fs');
let url = require("url");

const templateHTML = (title, list, body) => {
  return `<!doctype html>
  <html>
    <head>
    <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${body}
    </body>
  </html>`;
};

const templateList = (fileList) => {
  let list = "<ul>";
  let i = 0;
  while (i < fileList.length) {
    list += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
    i += 1;
  }
  list = list + "</ul>";
  return list;
};

let app = http.createServer((request,response) => {
    let _url = request.url;
    let queryData = new URL("http://localhost:3000" + _url).searchParams;
    let pathname = new URL("http://localhost:3000" + _url).pathname;
    
    if  (pathname === "/") {

      if (queryData.get("id") === null) {

        fs.readdir("./data", (err, fileList) => {

          let title = "welcome";
          let description = "hello, Node.js";
          let list = templateList(fileList);
          let template = templateHTML(title, list, `<h2>${title}</h2>${description}`);

          response.writeHead(200);
          response.end(template);
        });
      } else {

        fs.readdir('./data', (error, fileList) => {
          fs.readFile(`data/${queryData.get("id")}`, 'utf8', (err, description) => {
            let title = queryData.get("id");
            let list = templateList(fileList);
            let template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
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