self.addEventListener("install", function(event) {
    console.log("Service Worker Installing... skipping wait.");
    self.skipWaiting();
});

self.addEventListener("activate", function(event) {
    console.log("Service Worker Activating... clearing all caches.");
    event.waitUntil(
        caches.keys().then(function(names) {
            return Promise.all(names.map(name => caches.delete(name)));
        })
    );
});

self.addEventListener("fetch", function(event) {
    // No caching, always go to network to ensure login logic works
    event.respondWith(fetch(event.request));
});