(function () {
    var version = "1.1.0";
    var base = "/assets/";
    var modules = [
        base + 'modules/runtime.js',
        base + 'modules/packages.js',
        base + 'modules/loader.js',
        base + 'modules/fs.js',
        base + 'modules/audio.js',
        base + 'modules/graphics.js',
        base + 'modules/events.js',
        base + 'modules/fetch.js',
        base + 'modules/asm_consts.js',
        base + 'modules/main.js'
    ];
    if (typeof importScripts === 'function') {
        var versionedModules = modules.map(function (m) { return m + '?v=' + version; });
        importScripts.apply(null, versionedModules);
    } else {
        var loadNext = function (i) {
            if (i < modules.length) {
                var s = document.createElement('script');
                s.src = modules[i] + '?v=' + version;
                s.async = false;
                s.onload = function () { loadNext(i + 1); };
                s.onerror = function () { console.error('Failed to load module: ' + modules[i]); };
                document.body.appendChild(s);
            }
        };
        loadNext(0);
    }
})();