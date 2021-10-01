const uses = require("../data/uses-data");

function useExists(request, response, next) {
    const useId = Number(request.params.useId);
    const foundUse = uses.find(use => use.id === useId);
    if (foundUse) {
        response.locals.foundUse = foundUse;
        return next();
    }
    next({
        status: 404,
        message: `Use with ID ${request.params.useId} not found`
    })
}

function useExistsWithUrl(request, response, next) {
    const useId = Number(request.params.useId);
    const urlId = Number(request.params.urlId)
    const foundUse = uses.find(use => use.id === useId && use.urlId === urlId);
    if (foundUse) {
        return next();
    }
    next({
        status: 404,
        message: `Use with ID ${request.params.useId} for URL with ID ${request.params.urlId} not found`
    })
}

function list(request, response) {
    const { urlId } = request.params;
    const { useId } = request.params;
    let useResult;
    if (urlId && !useId) {
        useResult = (use) => use.urlId === Number(urlId);
    } else if (useId && urlId) {
        useResult = (use) => use.id === Number(useId) && use.urlId === Number(urlId);
    } else {
        useResult = () => true;
    }
    response.json({ data: uses.filter(useResult) });
};

function read(request, response) {
    response.json({ data: response.locals.foundUse });
}

function destroy(request, response) {
    const { useId } = request.params;
    const foundIndex = uses.findIndex(use => use.id === useId);
    uses.splice(foundIndex, 1);
    response.sendStatus(204);
}

module.exports = {
    list,
    useExistsWithUrl,
    read: [useExists, read],
    delete: [useExists, destroy],
}