// const { createServer } = require('http');
// const { parse } = require('url');
// const next = require('next');

// const port = process.env.PORT || 3000;

// // Create the Next.js app
// const app = next({ dev: false });
// const handle = app.getRequestHandler();

// app
//   .prepare()
//   .then(() => {
//     createServer((req, res) => {
//       const parsedUrl = parse(req.url, true);
//       const { pathname, _ } = parsedUrl;

//       // Add your allowed hosts here
//       const allowedHosts = [
//         'https://www.nim23.com',
//         'https://nim23.com',
//         'https://postimg.cc',
//         'https://i.postimg.cc',
//         'https://drive.google.com'
//       ];

//       // Check if the origin is allowed
//       const { origin } = req.headers;
//       if (allowedHosts.includes(origin)) {
//         res.setHeader('Access-Control-Allow-Origin', origin);
//         res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//         res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//       }

//       // Continue handling the request
//       handle(req, res, parsedUrl);
//       // console.log('pathname', pathname);
//     }).listen(port, (err) => {
//       if (err) throw err;
//       console.log(`> Ready on http://localhost:${port}`);
//     });
//   })
//   .catch((ex) => {
//     console.error(ex.stack);
//     process.exit(1);
//   });
