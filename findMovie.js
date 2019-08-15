//import {actionOne} from'./searchQuestions.js'
const 
    fetch = require('node-fetch'),
    cheerio = require('cheerio'),
    RarbgApi = require('rarbg'),
    log = console.log,
    process = require('process'),
    fs = require('fs'),
    clear = require('clear'),

    //url for imdb
    url = 'https://www.imdb.com/find?s=tt&ttype=ft&ref_=fn_ft&q=',

    rarbg = new RarbgApi({
        host: 'torrentapi.org',
        path: '/pubapi_v2.php?',
        app_id: 'my_application',
        user_agent: 'My Application 0.0.1'
    });
//Function calls search method for movies
function searchMovies(searchTerm){
    return fetch(`${url}${searchTerm}`)
    .then(response => response.text());
}

function search(){
    searchMovies(titleOfMovieToFind, yearOfMovie).then(body => {
        const
            movies = [],
            $ = cheerio.load(body);

        $('.findResult').each(function(i, element){
            const 
                $element = $(element),
                $url = $element.find('td.result_text a'),
                $title = $element.find('td.result_text'),
                movie ={
                title: $title.text().trim(),
                id: $url.attr('href').match(/title\/(.*)\//)[1],
            };
            movies.push(movie);
        });
        for (let i = 0; i < movies.length; i++){
            if (yearOfMovie == (/\(([^)]+)\)/.exec(movies[i].title)[1])){
                // log(/\(([^)]+)\)/.exec(movies[i].title)[1]);
                movie=(movies[i].title);
                imdbId=movies[i].id;
                break;
            }
        }
        rarbg.search({
            search_imdb: imdbId,
            sort:'seeders',
            limit:3,
            category: [rarbg.categories.MOVIES_X264_1080, rarbg.categories.MOVIES_X264_4K, rarbg.categories.MOVIES_X265_4K, rarbg.categories.MOVIES_X265_4K_HDR]
          }).then(res => {
            for(let i = 0; i < res.length; i++){
                if(i == 0){
                    //log('\x1b[1m\x1b[32m%s\x1b[0m','Most Seeders\n{');
                    log('\x1b[32m%s\x1b[0m',`\n\n**${movie} has been added to movies.csv**`);
                    log('\x1b[33m%s\x1b[0m','name:\n  ',res[i].filename);
                    log('\x1b[34m%s\x1b[0m','torrent:\n\t',res[i].download,'\n\n');
                    //log('\x1b[1m\x1b[32m%s\x1b[0m','} ')
                    let
                        torrent = res[i].download;
                    fs.appendFileSync('movies.csv',`${movie},${torrent}\n`);
                 }
                // else{
                //     log('\x1b[33m%s\x1b[0m','name:\n  ',res[i].filename);
                //     log('\x1b[34m%s\x1b[0m','torrent:\n\t',res[i].download);
                //     log('\n');
                // }
            }
          }).catch(console.error);
})};

let 
    titleOfMovieToFind = '';
    yearOfMovie = 0;
process.argv.forEach((val, index) => {
    if(index == 2){
        titleOfMovieToFind = val;
    }
    if (index == 3){
        yearOfMovie = val;
    }
});

clear();
search(titleOfMovieToFind, yearOfMovie);
