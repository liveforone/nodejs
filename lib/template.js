module.exports = {
  HTML : (title, list, body, control) => {
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
  },
  list : (topics) => {
    let list = "<ul>";
    let i = 0;
    while (i < topics.length) {
      list += `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i += 1;
    }
    list = list + "</ul>";
    return list;
  },
  authorSelect : (authors, authorId) => {
    let tag = "";
    let i = 0;
    while(i < authors.length) {
      let selected = "";
      if (authors[i].id === authorId) {
        selected = " selected";
      }
      tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`;
      i++;
    }
    return `
    <select name="author">
      ${tag}
    </select>
    `
  }
};