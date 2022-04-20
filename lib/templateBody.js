const template = require("./template");

module.exports = {
    templateCbody : (authors) => {
        return `
    <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
            <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
        ${template.authorSelect(authors)}
        </p>
        <p>
            <input type="submit">
        </p>
    </form>
    `;
    },
    templateUbody : (id, title, description, authors, authorId) => {
        return `
            <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${id}">
                <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                <p>
                  <textarea name="description" placeholder="description">${description}</textarea>
                </p>
                <p>
                ${template.authorSelect(authors, authorId)}
                </p>
                <p>
                  <input type="submit">
                </p>
            </form>
        `;
    }
};