'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "d5c8157e7468ce5dfd83006cd76fa021",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/images/1.jpeg": "5a936953262568295cc24abbd9bf5694",
"assets/images/10.jpg": "5ed1f0645d7274afb36c2728b9396772",
"assets/images/11.jpg": "1515b0fcdc8c44d6a63c1b74e2ff8854",
"assets/images/12.jpg": "012290912ce4d103efb99a68a638592b",
"assets/images/13.jpg": "205bf39a11f6c12ad1741735f62dd1a0",
"assets/images/14.jpg": "e4137c5df5a58092afc6a19898a63e64",
"assets/images/15.jpg": "f20d1b41dd12beaa0e95f87daeabf8bc",
"assets/images/16.jpg": "adbbf8ccd74369dfba573ea0e2307d00",
"assets/images/17.jpg": "d4912a39483b03b2654b2f7c3252724f",
"assets/images/18.jpg": "ee90b7923af24420472d42a61f7070ed",
"assets/images/19.jpg": "bcef10b5583bef2766805388d33c62f4",
"assets/images/2.jpeg": "06444df4c7c7b8797e95b1f8005841ba",
"assets/images/20.jpg": "b67b2e43fd7305c457247b50259b9d7e",
"assets/images/21.jpg": "33f5aa4709e53889e94143bada22e4b2",
"assets/images/22.jpg": "8b9ec3b8f2e151cda2c1c1b50ad390cf",
"assets/images/23.jpg": "d8bc366840ca826710da7063cfa026e6",
"assets/images/24.jpg": "82491b5a00f15a1948dc0472c7e6c1c2",
"assets/images/25.jpg": "54d70b7ca042087089a59ba4c5558433",
"assets/images/3.jpeg": "9f3a87bef9b6d0a006bafe64387470f3",
"assets/images/4.jpeg": "677bed059ca25c515c5983b5b1b210f9",
"assets/images/5.jpeg": "f42cfacc47d910c3db11a3f381e91778",
"assets/images/5.jpg": "12634ec3bf25dd471de57c908a482413",
"assets/images/6.jpeg": "28e9505bf909c38deadab6aa13bbcf54",
"assets/images/7.jpg": "e80be03d014f935c5c5acb979c55fad5",
"assets/images/8.jpg": "99765cf1203d34f50b247f8b2908f271",
"assets/images/9.jpg": "58afbb8bc242d550a7059168a0a028fa",
"assets/images/song.mp3": "fdf0ca9f1052668e398ddccc224b4216",
"assets/NOTICES": "c7913c370d3954c5b782ac7dbd5d3ce5",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/shaders/ink_sparkle.frag": "ac148ac874f94d39ed904e5761478cc7",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.ico": "7879a80843b86836a48124af07457f03",
"flutter.js": "0816e65a103ba8ba51b174eeeeb2cb67",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "0ef440512aa7403d2c82c1975d8cf0e0",
"/": "0ef440512aa7403d2c82c1975d8cf0e0",
"main.dart.js": "3ccb6618fabbececad212d418e4b3eee",
"manifest.json": "183f65216788dbea23548412749d6b2a",
"version.json": "10098b78a1f937fb333abebb3f193de5"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
