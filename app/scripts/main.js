Zepto(function($){
    var today = moment().format("M-D");
    getReelForDate(today).then(function(data){
        $(".reel").attr("src", data.url);
    }).catch(function(err){
        console.error(err);
    });
});

var getReelForDate = function(today){
    var deferred = Q.defer();
    $.ajax({
        type: "GET",
        url: "http://archive.org/advancedsearch.php",
        data: {
            "q": "collection:(universal_newsreels) AND identifier:(*"+today+"*)",
            "fl[]": "description, identifier, title",
            "sort": "avg_rating+desc",
            "rows": "50",
            "page": "1",
            "output": "json",
        },
        dataType: 'jsonp',
        success: function(data){
            all_reels = data.response.docs;
            if(all_reels.length > 0){
                reel = all_reels[Math.floor(Math.random()*all_reels.length)];
                reel.url = "http://archive.org/download/"+reel.identifier+"/"+reel.identifier+"_512kb.mp4";
                deferred.resolve(reel);
            } else {
                deferred.reject("No newsreels found for "+today);
            }
        },
        error: function(xhr, type){
            deferred.reject(type+" error! "+xhr.statusText);
        }
    });
    return deferred.promise;
};