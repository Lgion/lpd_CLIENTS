const compress_images = require("compress-images");

//[jpg+gif+png+svg] ---to---> [jpg(webp)+gif(gifsicle)+png(webp)+svg(svgo)]
compress_images(
    "images/**/*.{jpg,JPG,jpeg,JPEG,gif,png,svg}",
    "build/img/",
    { compress_force: false, statistic: true, autoupdate: true },
    false,
    { jpg: { engine: "webp", command: false } },
    { png: { engine: "webp", command: false } },
    { svg: { engine: "svgo", command: false } },
    { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
    function () {
        //-------------------------------------------------
        //[jpg] ---to---> [jpg(jpegtran)] WARNING!!! autoupdate  - recommended to turn this off, it's not needed here - autoupdate: false
        compress_images(
            "src/img/source/**/*.{jpg,JPG,jpeg,JPEG}",
            "src/img/combine/",
            { compress_force: false, statistic: true, autoupdate: false },
            false,
            {
                jpg: {
                engine: "jpegtran",
                command: ["-trim", "-progressive", "-copy", "none", "-optimize"],
                },
            },
            { png: { engine: false, command: false } },
            { svg: { engine: false, command: false } },
            { gif: { engine: false, command: false } },
            function () {
                //[jpg(jpegtran)] ---to---> [jpg(mozjpeg)] WARNING!!! autoupdate  - recommended to turn this off, it's not needed here - autoupdate: false
                compress_images(
                "src/img/combine/**/*.{jpg,JPG,jpeg,JPEG}",
                "build/img/",
                { compress_force: false, statistic: true, autoupdate: false },
                false,
                { jpg: { engine: "mozjpeg", command: ["-quality", "75"] } },
                { png: { engine: false, command: false } },
                { svg: { engine: false, command: false } },
                { gif: { engine: false, command: false } },
                function () {
                    //[png] ---to---> [png(pngquant)] WARNING!!! autoupdate  - recommended to turn this off, it's not needed here - autoupdate: false
                    compress_images(
                    "src/img/source/**/*.png",
                    "build/img/",
                    { compress_force: false, statistic: true, autoupdate: false },
                    false,
                    { jpg: { engine: false, command: false } },
                    {
                        png: { engine: "pngquant", command: ["--quality=30-60", "-o"] },
                    },
                    { svg: { engine: false, command: false } },
                    { gif: { engine: false, command: false } },
                    function () {}
                    );
                }
                );
            }
        );
        //-------------------------------------------------
    }
);
