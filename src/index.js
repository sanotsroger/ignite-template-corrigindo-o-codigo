const express = require("express");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const id = uuid();
  const likes = 0

  const repository = {
    id,
    title,
    url,
    likes,
    techs
  }

  repositories.push(repository)

  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: 'Repository not found' })
  }

  const repository = repositories[repositoryIndex] = {
    ... repositories[repositoryIndex],
    ... {
      title,
      url,
      techs
    }
  }

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" })
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    response.status(404).json({'error': 'Repository not found'})
  }

  const { title, url, likes: likeCount, techs } = repositories[repositoryIndex]
  const likes = likeCount + 1

  const repository = {
    id,
    title,
    url,
    likes,
    techs
  }

  repositories[repositoryIndex] = repository

  return response.json(repository);
});

module.exports = app;