// grabs articles that are contained in the database and converts them to  a JSOn object
$.getJson("/articles", function(data){
    // for each one
    for(var i = 0; i < data.length; i++){
        // display the appropriate information on the page and puts them into p tags and 
        // sets the elements data-id tag equal to the _id that was generated by mongo
        $("#articles").append("<p data-id ='" + data[i]._id+ "'>"+ data[i].title + data[i].link + "</p>");
    }
});


// this is triggered when someone clicks on the element that was created above
$(document).on("click", "p", function(){
    // this empties the section where a user enters in a note
    $("#notes").empty();
    // save the id from the p tag 
    var thisId = $(this).attr("data-id");

    // make an ajax call to the articles database in rest api
    $.ajax({
        method:"GET",
        url: "/article" + thisId
    })
    // adds the note information to the page
    .then(function(data){
        console.log(data);
        // the title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // an input to enter a new title 
        $("#notes").append("<input id = 'titleinput' name = 'title' >");
        // a textArea to add a new note body
        $("#notes").append("<textarea id = 'bodyinput' name = 'body'> </textarea>" );
        // a Button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id=' " + data._id + "'id = 'savenote'>Save Note</button>");

        // if there is a note in the article
        if(data.note){
            // place the title of the note in the title input
            $("#titleinput").val(data.note.title);
            // place the body of the note in the body text area
            $("#bodyinput").val(data.note.body);
        }
    });
});
    // when you clic thte savenote button 
$(document).on("click", "#savenote", function(){
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    // Run a Post request to change the note, using what is entered in the input field
    $.ajax({
        method: "POST",
        url:"/articles/" + thisId,
        data:{
            // value grabbed from the title input field
            title: $("#titleinput").val(),
            // the body content from the user text field
            body: $("#bodyinput").val()
        }
    })
    .then(function(data){
        // logs the data that has been passed back into the database
        console.log(data);
        // Empty the notes section
        $("#notes").eempty();
    });
    // Also, remove the values entered in the input and textarea for note reentry
    $("#titleinput").val("");
    $("#bodyinput").val("");
})