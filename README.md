# ShoutValley API
Welcome to the API for ShoutValley! 

This is ths back end of [ShoutValley](https://shoutvalley.herokuapp.com/api)



## Background

ShoutValley API was made for the purpose of accessing application data for the ShoutValley web app programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

The database is be PSQL, and you interact with it using [node-postgres](https://node-postgres.com/)

## Local Setup

Ensure that you have cloned down the repo first.

You will need to make your own public repo so that you can share this project as part of your portfolio by doing the following:

Create a new public GitHub repository. Do not initialise the project with a readme, .gitignore or license.
From your cloned local version of this project you'll want to push your code to your new repository using the following commands:

```sh
git remote set-url origin YOUR_NEW_REPO_URL_HERE  
git branch -M main  
git push -u origin main  
```

There are databases in this project. One for real looking *dev data* and another for simpler *test data*.

If you are reproducing this Repo locally, You will need to create two .env files for your project: `.env.test` and `.env.development`. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names).

You have also been provided with a db folder with some data, a `setup.sql` file and a seeds folder. You should also take a minute to familiarise yourself with the npm scripts you have been provided.

The job of index.js in each the data folders is to export out all the data from that folder, currently stored in separate files. This is so that, when you need access to the data elsewhere, you can write one convenient require statement - to the index file, rather than having to require each file individually. Think of it like a index of a book - a place to refer to! Make sure the index file exports an object with values of the data from that folder with the keys:

- topicData
- articleData
- userData
- commentData

### Minimum Versions

Node: 17x
Postgres: 8.7.x
---
