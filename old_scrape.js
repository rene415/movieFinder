const
    request = require('request'),
    cheerio = require('cheerio'),
    fs = require('fs');

fs.appendFileSync('horror.csv',`________\n`);

function checkNum(title){
    var number = parseInt(title);
    if(Number.isInteger(number)){
        return('number');
    }
};

function ft_grabMovie(link, title){
    
    if(link != undefined && title != "→" && title != "←" && checkNum(title) != 'number'){
        request(link, (error, response, html) =>{
            if (!error && response.statusCode == 200){
                var
                    $ = cheerio.load(html),
                    englishTitle = "",
                    yearOfMovie = "";

                $('.extras').each(function(i, el){
                    yearOfMovie = $(el).text().replace(/\s\s+/g, '');
                    yearOfMovie = yearOfMovie.substring(yearOfMovie.length-4)
                    yearOfMovie = "("+yearOfMovie+")";
                });
                $('.ori_title').each(function(i, el){
                    englishTitle = $(el).text();
                });
                
                $('.green').each(function(i, el){
                    const
                        torrentLink = $(el).attr('href');
                if(link != "http://playtorrent.org/estrenos" && link != "http://playtorrent.org/mejor-valoradas" && link != undefined && title != /\d/g){
                    fs.appendFileSync('new movies.csv',`${englishTitle +" "+yearOfMovie},${title},${torrentLink},${englishTitle}\n`);
                }
                });  
            }
        });
    };
}

request('https://playtorrent.org/generos/terror/page/20/', (error, response, html) =>{
    if (!error && response.statusCode == 200){
        const
            $ = cheerio.load(html);
        $('.containerxbusca a').each(function(i, el){
            const
                title = $(el).text().replace(/\s\s+/g, ''),
                link = $(el).attr('href');   
                
            ft_grabMovie(link, title);
        });
        console.log("\nScrape is done\n");
    }
});