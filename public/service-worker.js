var cacheName = 'studu-pwa';
//var dataCacheName = 'studu-data';
var filesToCache = [
  '/',
  '/index.html',
  '/404.html',
  '/sign-up.html',
  'student/home.html',
  'student/calendar.html',
  'student/calendar-editor.html',
  'student/new-quarter.html',
  'student/communication.html',
  'student/grades.html',
  'teacher/home.html',
  'teacher/calendar.html',
  'teacher/calendar-editor.html',
  'teacher/new-quarter.html',
  'teacher/communication.html',
  'teacher/grades.html',
  'teacher/student-portfolios.html'
  '/scripts/app.js',
  '/scripts/jquery-3.3.1.min.js',
  '/scripts/materialize.js',
  '/scripts/init.js',
  '/styles/materialize.css',
  '/styles/style.css'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  /*
   * Fixes a corner case in which the app wasn't returning the latest data.
   * You can reproduce the corner case by commenting out the line below and
   * then doing the following steps: 1) load app for first time so that the
   * initial New York City data is shown 2) press the refresh button on the
   * app 3) go offline 4) reload the app. You expect to see the newer NYC
   * data, but you actually see the initial data. This happens because the
   * service worker is not yet activated. The code below essentially lets
   * you activate the service worker faster.
   */
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
