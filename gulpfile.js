const {src, dest, watch, parallel, series} = require('gulp');
const scss = require('gulp-sass')(require('sass')); 
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin')
const del = require('del')

function scripts (){
    return src([
        'node_modules/jquery/dist/jquery.js',
        'app/Js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/Js'))
    .pipe(browserSync.stream())

}

function styles (){
    return src('app/scss/style.scss')
        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],
            grid: true
        }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function build(){
    return src([
        'app/css/style.min.css',
        'app/Js/main.min.js',
        'app/fonts/**/*',
        'app/*.html'    
    ], {base:'app'})
    .pipe(dest('dist'))
}

function imageMin(){
    return src ('app/images/**/*')
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]})
        ]))
    .pipe(dest('dist/images'))    
}

function cleanDist (){
    return del('dist')

}

function browsersync (){
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
});
}

function watching(){
    watch(['app/scss/**/*scss'], styles);
    watch(['app/Js/main.js', '!app/Js/main.min.js'], scripts);
    watch(['app/*.html']).on('change', browserSync.reload);

}


exports.watching = watching;
exports.browsersync = browsersync;
exports.styles = styles;
exports.scripts = scripts;
exports.imageMin = imageMin;
exports.cleanDist = cleanDist;


exports.build = series (cleanDist,imageMin, build);
exports.default = parallel(scripts, browsersync, watching);
