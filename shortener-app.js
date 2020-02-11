const React = require('react');
const ReactDom = require('react-dom');

const ShortenerWs = require('./shortener-ws');

const App = require('./components/app.jsx');

function main() {
  const ws = new ShortenerWs();
  const app = <App ws={ws}/>;
  ReactDom.render(app, document.getElementById('app'));
}

main();
