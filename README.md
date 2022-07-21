# Proyecto 16: Calculadora de consumos y propinas usando REST API y JSON Server
- **Curso:** [JavaScript Moderno Guía Definitiva Construye +15 Proyectos en Udemy](https://www.udemy.com/course/javascript-moderno-guia-definitiva-construye-10-proyectos/)
- **Profesor:** Juan Pablo De La Torre Valdez

Este proyecto utiliza JSON Server por lo que a diferencia de los otros, el Deployment en GitHub Pages no funciona. Para correr el proyecto se debe de descargar [NodeJS](https://nodejs.org/es/) e instalar [JSON Server](https://www.npmjs.com/package/json-server) por medio de NPM

```console
npm install -g json-server
```

Luego de instalarlo, se debe de poner el siguiente comando en la terminal de la carpeta del proyecto:

```console
json-server --watch db.json --port 4000
```

Finalmente, se puede abrir [index.html](https://github.com/lopezemmanuel/JavaScriptModerno2022_CalculadoraPropinas/blob/main/index.html) y probar el proyecto.
