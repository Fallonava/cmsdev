const matcherRegex = /^\/((?!api|_next\/static|_next\/image|.*\..*).*)$/;

const paths = [
  "/admin/login",
  "/admin",
  "/_next/static/chunks/123doanyjnwwq.css",
  "/_next/static/media/797e433ab948586e-s.p.09zddjkbdep5a.woff2",
  "/favicon.ico",
];

paths.forEach(p => {
  const matches = matcherRegex.test(p);
  console.log(`Path: ${p} -> Matches: ${matches}`);
});
