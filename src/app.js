const express = require("express");

const app = express();

app.use(express.json());

const urlsRouter = require("./urls/urls.router");
const usesRouter = require("./uses/uses.router");

// TODO: Add code to meet the requirements and make the tests pass.
//Routes
app.use("/urls", urlsRouter);
app.use("/uses", usesRouter);

//NotFound
app.use((request, response, next) => {
    return next({
        status: 404,
        message: `Not found ${request.originalUrl}`,
    })
})

//Error handler
app.use((error, request, response, next) => {
  console.error(error);
  const { status = 500, message = "Something went wrong!" } = error;
  response.status(status).json({ error: message });
});

module.exports = app;
