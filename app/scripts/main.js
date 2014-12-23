// Talk to archive.org
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
        dataType: "jsonp",
        success: function(data){
            var all_reels = data.response.docs;
            if(all_reels.length > 0){
                var reel = all_reels[Math.floor(Math.random()*all_reels.length)];
                reel.url = "http://archive.org/download/"+reel.identifier+"/"+reel.identifier+"_512kb.mp4";
                deferred.resolve(reel);
            } else {
                deferred.reject("No newsreels found");
            }
        },
        error: function(xhr, type){
            deferred.reject(type+" error! "+xhr.statusText);
        }
    });
    return deferred.promise;
};

// Pipe in video data to the page
var updatePage = function(chosen_date){
    if(chosen_date !== moment().format("MM-DD")){
        $(".datepicker").html(chosen_date+" <i class='fa fa-chevron-down'></i>");
    }

    getReelForDate(chosen_date).then(function(data){
        $(".reel").attr("src", data.url);
        $(".reel-title").text(data.title);
        $(".reel-description").text(data.description);
    }).catch(function(err){
        console.error(err);
        if(err === "No newsreels found"){
            $(".reel-title").text("Nothing found on this date. Warp again!");
        }
    });
};

// Get the video on page load
Zepto(function(){
    var today = moment().format("MM-DD");
    updatePage(today);
});

// Fix the height of the video container
Zepto(function($){
    $(".container").height($(".tv").height());
    $(window).on("resize", function() {
        window.requestAnimationFrame(function(){
            $(".container").height($(".tv").height());
        });
    });
});

// Animate loading dots while video is being fetched
Zepto(function($){
    window.setInterval(function(){
        if($(".dots-animate").text() === "..."){
            $(".dots-animate").text(".");
        } else {
            $(".dots-animate").text($(".dots-animate").text()+".");
        }
    },500);

});

// Toggle the datepicker on clicking "today"
Zepto(function($){
    $(".datepicker").click(function(){
        $(".datepicker-dropdown").toggleClass("hide");
    });
});

// Set the datepicker form placeholders to today's date
Zepto(function($){
    $(".datepicker-input#day").attr("placeholder", moment().format("DD"));
    $(".datepicker-input#month").attr("placeholder", moment().format("MM"));
});

// Get a new video on clicking "Warp!"
Zepto(function($){
    $(".datepicker-button").click(function(){
        var day = $(".datepicker-input#day").val();
        var month = $(".datepicker-input#month").val();

        // validate the form
        if (moment(new Date(2000, month, day))._d !== "Invalid Date"){
            $(".datepicker-dropdown").toggleClass("hide");
            $(".reel-title").html("Warping through time<span class='dots-animate'></span>");
            updatePage(moment(new Date(2000, month-1, day)).format("MM-DD"));
        } else {
            alert("Not a valid date.");
        }
    });
});