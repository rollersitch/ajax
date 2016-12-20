
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-article');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street = $(".form-container #street").val();
    var city = $(".form-container #city").val();
    // YOUR CODE GOES HERE!
    var locStr = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + 
                                          street +
                                          ', ' +
                                          city;
    //console.log(locStr);
    $("<img>").addClass('bgimg').attr('src',locStr).appendTo($body);
   // $body.append('<img class="bgimg" src="' + locStr + '">');
   
   
   
   // Ny-Times article
   var url = "https://api.nytimes.com/svc/search/v2/articleearch.json";
   /*url += '?' + $.param({
            'api-key': "98db81e29f064896b48583113beeb52f"
                        });*/
   var searchUrl = url + '?q=' + city + '&sort=newest&api-key="98db81e29f064896b48583113beeb52f"';
                        
    $.getJSON( searchUrl, function( data ) {
        $nytHeaderElem.text("New York Times article about " + city);
        var article = data.response.docs;
        
        for(var i=0,j=article.length; i<j; i++){
          var article = article[i];
          $nytElem.append('<li class="article">' + 
                                '<a href="' + article.web_url +'">' +
                                article.headline.main +
                                '</a>' +
                                '<p>' + article.snippet +
                                '</p>' +
                            '</li>');        
        };
        
    }).error(function(e) {
        $nytHeaderElem.html("<strong>New York Times article cannot be Loaded</strong>");
    });



    // Wikipedia article
    var wikiTimeOut = setTimeout(function() {
        $wikiElem.text("Failed to load Wikipedia article");
    }, 8000);
    
    var wikiUrl = 'http://en.wikipekdia.org/w/api.php?action=opensearch&search=' + city + '&format=json&callback=wikiCallback'; 
    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function (response) {
            var articleList = response[1];
            for (var i=0; i < articleList.length; i++) {
              var articletr = articleList[i];
              var url = 'http://en.wikipedia.org/wiki/' + articletr;
              $wikiElem.append('<li><a href="' + url + '">' +
                               articletr + '</a></li>');
              clearTimeout(wikiTimeout);
            };
        }
        
    });
    
   return false;
};


$('#form-container').submit(loadData);