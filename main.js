let http = require('http');
let fs = require('fs');
let url = require("url");
let qs = require("querystring");

const templateHTML = (title, list, body, control) => {
  return `<!doctype html>
  <html>
    <head>
    <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
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
          let template = templateHTML(title, list, 
            `<h2>${title}</h2>${description}`, 
            `<a href="/create">create</a>`);
          response.writeHead(200);
          response.end(template);
        });
      } else {

        fs.readdir('./data', (error, fileList) => {
          fs.readFile(`data/${queryData.get("id")}`, 'utf8', (err, description) => {
            let title = queryData.get("id");
            let list = templateList(fileList);
            let template = templateHTML(title, list, 
              `<h2>${title}</h2>${description}`,
              `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
            response.writeHead(200);
            response.end(template);
          });
        });
      }
    } else if (pathname === "/create") {
      fs.readdir('./data', (error, fileList) => {
        fs.readFile(`data/${queryData.get("id")}`, 'utf8', (err, description) => {
          let title = "WEB-create";
          let list = templateList(fileList);
          let template = templateHTML(title, list, `
            <form action="/process_create" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
            </form>
          `, "");
          response.writeHead(200);
          response.end(template);
        });
      });
    } else if (pathname ==="/process_create") {
      let body = "";
      request.on("data", (data) => {
        body += data;
      });
      request.on("end", () => {
        let title = new URLSearchParams(body).get("title");
        let description = new URLSearchParams(body).get("description");
        fs.writeFile(`data/${title}`, description, "utf8", (err) => {
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        });
      });
    } else if (pathname === "/update") {
      fs.readdir('./data', (error, fileList) => {
        fs.readFile(`data/${queryData.get("id")}`, 'utf8', (err, description) => {
          let title = queryData.get("id");
          let list = templateList(fileList);
          let template = templateHTML(title, list, 
            `
            <form action="/update_create" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
              <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
          response.writeHead(200);
          response.end(template);
        });
      });
    } else {

      response.writeHead(404);
      response.end("Not found");
    }    
});
app.listen(3000);