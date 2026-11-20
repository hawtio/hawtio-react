# Hawtio React - specifically for embedding in React single-page applications

A Hawtio reimplementation based on TypeScript + React.

## Usage
This version is specifically tailored to allow for insertion of the console into other React SPAs.
The most important change is the replacement of the React BrowserRouter with the MemoryRouter. While
this allows for the 'nesting of Routers', it does mean that the browser address bar is not updated
when a new page is navigated to in the hawtio console.

## Source Branch
https://github.com/hawtio/hawtio-next/tree/react18-memoryrouter-2.4

## Install

NPM

```console
npm i @hawtio/react
```

Yarn

```console
yarn add @hawtio/react
```

## Embedding into an app

To run Hawtio application in an embedded mode, have a look at the [embedded](https://github.com/hawtio/hawtio-react/tree/react18-memoryrouter-2.4.0/embedded) example application.

## License

Hawtio React is licensed under the [Apache 2.0 License](./LICENSE).
