let http = require('http');
let fs = require('fs');
let url = require("url");
let qs = require("querystring");
let template = require("./lib/template.js");
let templateBody = require("./lib/templateBody.js");
let path = require("path");
let senitizeHtml = require("sanitize-html");
let mysql = require("mysql");
let db = mysql.createConnection({
  host : "localhost",
  user : "root",
  password : "159624",
  database : "opentutorials"
});
db.connect();

let app = http.createServer((request,response) => {
    let _url = request.url;
    let queryData = new URL("http://localhost:3000" + _url).searchParams;
    let pathname = new URL("http://localhost:3000" + _url).pathname;

    if  (pathname === "/") {
      if (queryData.get("id") === null) {
        db.query(`SELECT * FROM topic`, (error, topics) => {  //fileList -> topics
          let title = "welcome";
          let description = "hello, Node.js";
          let list = template.list(topics);
          let html = template.HTML(title, list, 
            `<h2>${title}</h2>${description}`, 
            `<a href="/create">create</a>`);
          response.writeHead(200);
          response.end(html);
        });
      } else {
        // fs.readdir('./data', (error, fileList) => {
        //   let filteredId = path.parse(queryData.get("id")).base;  //id값을 찾지 못하도록 처리함
        //   fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
        //     let title = queryData.get("id");
        //     let senitizedTitle = senitizeHtml(title);
        //     let senitizedDescription = senitizeHtml(description, {
        //       allowedTags : ["h1"]
        //     });
        //     let list = template.list(fileList);
        //     let html = template.HTML(title, list, 
        //       `<h2>${senitizedTitle}</h2>${senitizedDescription}`,
        //       `<a href="/create">create</a> 
        //        <a href="/update?id=${senitizedTitle}">update</a>
        //        <form action="delete_process" method="post">
        //         <input type="hidden" name="id" value="${senitizedTitle}">
        //         <input type="submit" value="delete">
        //        </form>`);
        //        //삭제할땐 무조건 method="post"로 해야한다. 절대 링크방식의 get을 사용하면 안된다.
        //     response.writeHead(200);
        //     response.end(html);
        //   });
        // });
        db.query(`SELECT * FROM topic`, (error, topics) => {
          if (error) {
            throw error;
          }
          db.query(`SELECT * FROM topic WHERE id=?`, [queryData.get("id")] ,(error2, topic) => {  //fileList -> topics
            /*
            db id에 직접 접근하면 공격을 당할수도 있기에 id=?로 처리하고 배열로 id를 가져온다.
            */
            if (error2) {
              throw error2;
            }
            let title = topic[0].title;
            let description = topic[0].description;
            let list = template.list(topics);
            let html = template.HTML(title, list, 
              `<h2>${title}</h2>${description}`, 
              `<a href="/create">create</a> 
               <a href="/update?id=${queryData.get("id")}">update</a>
                <form action="delete_process" method="post">
                 <input type="hidden" name="id" value="${queryData.get("id")}">
                 <input type="submit" value="delete">
                </form>`);
            response.writeHead(200);
            response.end(html);
          });
        });
      }
    } else if (pathname === "/create") {
      fs.readdir('./data', (error, fileList) => {
        fs.readFile(`data/${queryData.get("id")}`, 'utf8', (err, description) => {
          let title = "WEB-create";
          let list = template.list(fileList);
          let html = template.HTML(title, list, templateBody.templateCbody(), "");
          response.writeHead(200);
          response.end(html);
        });
      });
    } else if (pathname ==="/create_process") {
      let body = "";
      request.on("data", (data) => {
        body += data;
      });
      request.on("end", () => {
        let post = new URLSearchParams(body);
        let title = post.get("title");
        let description = post.get("description");
        fs.writeFile(`data/${title}`, description, "utf8", (err) => {
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        });
      });
    } else if (pathname === "/update") {
      fs.readdir('./data', (error, fileList) => {
        let filteredId = path.parse(queryData.get("id")).base;  //id값을 찾지 못하도록 처리함
        fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
          let title = queryData.get("id")
          let list = template.list(fileList);
          let html = template.HTML(title, list, templateBody.templateUbody(title, description),
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
          response.writeHead(200);
          response.end(html);
        });
      });
    } else if (pathname === "/update_process") {
      let body = "";
      request.on("data", (data) => {
        body += data;
      });
      request.on("end", () => {
        let post = new URLSearchParams(body);
        let id = post.get("id");
        let title = post.get("title");
        let description = post.get("description");
        fs.rename(`data/${id}`, `data/${title}`, (err) => {
          fs.writeFile(`data/${title}`, description, "utf8", (err) => {
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          });
        });
      });
    } else if (pathname === "/delete_process") {
      let body = "";
      request.on("data", (data) => {
        body += data;
      });
      request.on("end", () => {
        let post = new URLSearchParams(body);
        let id = post.get("id");
        let filteredId = path.parse(id).base;  //id값을 찾지 못하도록 처리함
        fs.unlink(`data/${filteredId}`, (err) => {
          response.writeHead(302, {Location: `/`});
          response.end();
        });
      });
    } else {
      response.writeHead(404);
      response.end("Not found");
    }    
});
app.listen(3000);