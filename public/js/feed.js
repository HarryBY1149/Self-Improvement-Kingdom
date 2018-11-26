$(document).ready(function(){
    $.ajax({
        method: "GET",
        url: "/api/activity",
    }).then(function(response){
        console.log(response);
        for(var i = 0; i< response.length; i++){
            var news = response[i].action;
            var tickerItem = $("<div>");
            tickerItem.addClass("ticker-item");
            tickerItem.text(news);
            $(".ticker-move").append(tickerItem);
        }
    })

})