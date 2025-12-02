# uptask_backend

## What is MERN?
#
## Project Setup & Usage

This is the backend for the Uptask project, built with Node.js, Express, and TypeScript.

### Requirements
- Node.js (v18+ recommended)
- npm
- MongoDB (if using database features)


```

### Running the Development Server
Start the server in development mode:

```bash
npm run dev
```

The server will run on port 4000 by default. You can change the port by setting the `PORT` environment variable.

### Project Structure
- `src/index.ts`: Entry point, starts the server
- `src/server.ts`: Express app instance
- `package.json`: Scripts and dependencies


**MERN** stands for **MongoDB, Express, React, Node.js**.

A stack is a set of tools to build an app.

**Full Stack** means you can create the complete stack of an app, and the MERN Stack lets you do this, just like the PERN Stack.

Our backend uses Node with Express, but other options include Nest.js and Fastify.

## What is MongoDB?

A NoSQL database oriented to documents and large amounts of data.

Data is stored in a format similar to JSON (documents) called BSON.

Tables are called **Collections** and records are called **Documents**.

## What is NoSQL?

NoSQL databases are non-relational databases.

NoSQL databases are designed for specific data models and have flexible schemas for building modern applications.

These types of databases are common when there are a large number of read/write transactions and when data is not uniform or related.

## Mongoose

Object Data Modeling (ODM) for MongoDB

### What is Mongoose?

Mongoose is an ODM (Object Data Modeling) library for Node.js. An ODM is similar to an ORM (Object Relational Mapping), but instead of "Relational" it uses "Document" because MongoDB stores information as documents in collections.

Mongoose simplifies many tasks and is one of the most mature tools of its kind for Node.js.

Like Sequelize, you use Models to design the data types for your information.

It provides a large number of methods to perform various CRUD operations.

Mongoose is often used with other dependencies to handle user authentication, password hashing, and more.

Que es MVC?
Model View Controller

Patron de Arquitectura de Software que permite la separacion de obligaciones de cada pieza de tu codigo.

Enfatiza la separacion de la logica de programacion con la presentacion.

MVC es la arquitectura mas comun hoy en dia tanto para web y se utiliza en cualquier lenguaje.

Ventajas de MVC 

Un Mejos orden y escalabilidad en tu proyecto.

Al implementar una arquitectura probada como MVC todos los programadores de un grupo saben exactamente donde encontrar el condigo encargado de realizar alguna tarea.

Aprende MVC y cualquier framework MVC te sera facil de aprender.
## What is MVC?
Model View Controller

Software Architecture Pattern that allows the separation of responsibilities for each piece of your code.

Emphasizes the separation of programming logic from presentation.

MVC is the most common architecture today for web applications and is used in any language.

### Advantages of MVC

Better organization and scalability in your project.

By implementing a proven architecture like MVC, all programmers in a team know exactly where to find the code responsible for performing a specific task.

Learn MVC and any MVC framework will be easy to learn.

### What is the Model?

Responsible for everything related to data, database, and CRUD operations. The model is closely related to your ORM or ODM.

The Model will query a database but does not display that data.

### What is the View?

Responsible for everything that is displayed on screen (HTML).

The Model will query the database, but it is the View that displays the results.

In our project, React is the View.

### What is the Controller?

It communicates between Model and View. Before the Model queries the database, the Controller is responsible for calling it. Once the Model has queried the database, the Controller communicates the data to the View so it can be displayed.

### What is the Router?

Responsible for registering all the URLs or Endpoints supported by our application.

Example: If a user accesses a URL, the Router already has instructions to communicate with a specific Controller. That Controller knows which Model to call and which View to execute.