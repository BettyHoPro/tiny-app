const http = require("http");
const PORT = 3000;

// a function which handles requests and sends response
const requestHandler = function(request, response) {
  const route = `${request.url}`;
  switch (route) {
  case "/":
    response.statusCode = 200;
    response.write("Welcome !");
    response.end();
    break;
  case "/urls":
    response.statusCode = 200;
    response.write("www.lighthouselabs.ca\nwww.google.com");
    response.end();
    break;
  default:
    response.statusCode = 404;
    response.write("404 Page Not Found");
    response.end();
    response.render();
    break;
  }
};
const server = http.createServer(requestHandler);
console.log('Server created');
server.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});
console.log('Last line (after .listen call)');