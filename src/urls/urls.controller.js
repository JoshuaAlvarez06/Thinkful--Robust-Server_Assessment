const { response } = require("../app");
const urls = require("../data/urls-data");
const uses = require("../data/uses-data");

function bodyHasHref(request, response, next) {
    const { data: { href } = {} } = request.body;
    if (href) {
        response.locals.body = href;
        return next();
    };
    next({
        status: 400,
        message: `Body must include href`,
    })
}

function urlExists(request, response, next) {
    const urlId = Number(request.params.urlId)
    const foundUrl = urls.find(url => url.id === urlId);
    if (foundUrl) {
        response.locals.url = foundUrl;
        return next();
    } else {
        next({
            status: 404,
            message: `URL with ID ${request.params.urlId} not found`
        });
    };
};

function list(request, response) {
    response.json({ data: urls })
};

let lastUrlId = urls.reduce((maxId, url) => Math.max(maxId, url.id), 0);

function create(request, response) {
    const href = response.locals.body;
    const newUrl = {
        id: ++lastUrlId,
        href,
    }
    urls.push(newUrl);
    response.status(201).json({ data: newUrl })
};

let lastUsesId = uses.reduce((maxId, use) => Math.max(maxId, use.id), 0);

function read(request, response) {
    const newUse = {
        id: ++lastUsesId,
        urlId: response.locals.url.id,
        time: Date.now(),
    }
    uses.push(newUse);
    response.json({ data: response.locals.url })
};

function update(request, response) {
    const href = response.locals.body;
    const foundUrl = response.locals.url;
    const originalHref = foundUrl.href;
    foundUrl.href = href;
    response.json({ data: foundUrl })
}

module.exports = {
    list,
    create: [bodyHasHref, create],
    read: [urlExists, read],
    update: [bodyHasHref, urlExists, update],
    urlExists,
};