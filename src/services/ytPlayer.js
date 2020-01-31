export const ytPlayer = function() {
    let playerLoader = null;

    function getInstance(container) {
        if (!playerLoader) {
            playerLoader = loadYT.then(YT => {
                return new YT.Player(container, {
                    height: 360,
                    width: 640
                });
            });
        }

        return playerLoader;
    }

    return {
        getInstance
    }
}();
