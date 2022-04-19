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
      db.query(`SELECT * FROM topic`, (error, topics) => {
        if (error) {
          throw error;
        }
        db.query(`
        SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, 
        [queryData.get("id")], 
        (error2, topic) => {  //fileList -> topics
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
            `<h2>${title}</h2>${description} <p>by ${topic[0].name}</p>`, 
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
    db.query(`SELECT * FROM topic`, (error, topics) => {  //fileList -> topics
      db.query(`SELECT * FROM author`, (error2, authors) => {
        let title = "Create";          
        let list = template.list(topics);
        let html = template.HTML(title, list, templateBody.templateCbody(authors), "");
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
      db.query(
        `INSERT INTO topic (title, description, created, author_id) 
          VALUES(?, ?, NOW(), ?)`, 
        [post.get("title"), post.get("description"), post.get("author")],
        (error, result) => {
          if (error) {
            throw error;
          }
          response.writeHead(302, {Location: `/?id=${result.insertId}`});
          response.end();
      });
    });
  } else if (pathname === "/update") {
    db.query(`SELECT * FROM topic`, (error, topics) => {
      if (error) {
        throw error;
      }
      db.query(`SELECT * FROM topic WHERE id=?`, [queryData.get("id")] ,(error2, topic) => {
        if (error2) {
          throw error2;
        }
        db.query(`SELECT * FROM author`, (error2, authors) => {
          let id = topic[0].id;
          let title = topic[0].title;
          let description = topic[0].description;
          let authorId = topic[0].author_id;
          let list = template.list(topics);
          let html = template.HTML(topic[0].title, list, templateBody.templateUbody(id, title, description, authors, authorId),
          `<a href="/create">create</a> <a href="/update?id=${id}">update</a>`);
          response.writeHead(200);
          response.end(html);
        });
      });
    });
  } else if (pathname === "/update_process") {
    let body = "";
    request.on("data", (data) => {
      body += data;
    });
    request.on("end", () => {
      let post = new URLSearchParams(body);
      db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
      [post.get("title"), post.get("description"), post.get("author"), post.get("id")],
      (error, result) => {
        response.writeHead(302, {Location: `/?id=${post.get("id")}`});
        response.end();
      });
    });
  } else if (pathname === "/delete_process") {
    let body = "";
    request.on("data", (data) => {
      body += data;
    });
    request.on("end", () => {
      let post = new URLSearchParams(body);
      db.query(`DELETE FROM topic WHERE id=?`, [post.get("id")], (error, result) => {
        if (error) {
          throw error;
        }
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