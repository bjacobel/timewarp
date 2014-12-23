Zepto(function($){
    var today = moment().format("M-D");
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
            reel = all_reels[Math.floor(Math.random()*all_reels.length)];
            reel.url = "http://archive.org/download/"+reel.identifier+"/"+reel.identifier+"_512kb.mp4";
            $(".reel").attr("src", reel.url);
        },
        error: function(xhr, type){
            console.error(type+" error! "+xhr.statusText);
        }
    });
});