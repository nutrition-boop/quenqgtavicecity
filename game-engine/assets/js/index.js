(function () {
    var version = "1.1.0";
    var base = "https://vc.quenq.com/";
    var modules = [
        base + 'assets/modules/runtime.js',
        base + 'assets/modules/packages.js',
        base + 'assets/modules/loader.js',
        base + 'assets/modules/fs.js',
        base + 'assets/modules/audio.js',
        base + 'assets/modules/graphics.js',
        base + 'assets/modules/events.js',
        base + 'assets/modules/fetch.js',
        base + 'assets/modules/asm_consts.js',
        base + 'assets/modules/main.js'
    ];
    if (typeof importScripts === 'function') {
        var versionedModules = modules.map(function (m) { return m + '?v=' + version; });
        importScripts.apply(null, versionedModules);
    } else {
        var loadNext = function (i) {
            if (i < modules.length) {
                var s = document.createElement('script');
                s.src = modules[i] + '?v=' + version;
                s.async = false; // Ensure order
                s.crossOrigin = 'anonymous';
                s.onload = function () { loadNext(i + 1); };
                s.onerror = function () { console.error('Failed to load module: ' + modules[i]); };
                document.body.appendChild(s);
            }
        };
        loadNext(0);
    }
})();