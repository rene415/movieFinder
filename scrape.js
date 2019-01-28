const
    request = require('request'),
    cheerio = require('cheerio'),
    fs = require('fs');

fs.appendFileSync('results.csv',`________\n`);

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
                const
                    $ = cheerio.load(html);
                $('.green').each(function(i, el){
                    const
                        torrentLink = $(el).attr('href');
                if(link != "http://playtorrent.org/estrenos" && link != "http://playtorrent.org/mejor-valoradas" && link != undefined && title != /\d/g){
                    fs.appendFileSync('results.csv',`${title},${torrentLink}\n`);
                }
                });  
            }
        });
    };
}

request('http://playtorrent.org/page/10/', (error, response, html) =>{
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