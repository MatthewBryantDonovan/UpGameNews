$(document).ready(function(){
  $('.sidenav').sidenav();
});

// On click to display notes
$(document).on("click", "p", function () {
  $(".notes").empty();
  var thisId = $(this).attr("data-id");
  var isSaved = $(this).attr("data-saved");
  

  if (isSaved == "true") {
    // Ajax call for the Article to display notes
    $.ajax({
        method: "GET",
        url: "/api/articles/saved/" + thisId
      })
      .then(function (data) {
        console.log(data);
        $(".note" + data._id).append("<h2 class='center'>" + data.title + "</h2>");

        for (let index = 0; index < (data.note.length + 1); index++) {
          var noteID = -1;
          if (data.note[index]) {
            noteID = data.note[index]._id;
          }
          $(".note" + data._id).append("<div class='noteArea col m4 " + index + "noteArea" + data._id + "'></div>");
          $("." + index + "noteArea" + data._id).append("<h2 class='center'> Note #" + (index + 1) + "</h2>");
          $("." + index + "noteArea" + data._id).append("<input class='titleinput" + [index] + "' name='title' style='background-color: #FCF5C7; border: 2px solid black'>");
          $("." + index + "noteArea" + data._id).append("<textarea class='bodyinput" + [index] + "' name='body' style='background-color: #FCF5C7; border: 2px solid black'></textarea>");
          $("." + index + "noteArea" + data._id).append("<button class='red darken-4 z-depth-5left btn savenote' data-id='" + data._id + "' data-note='" + noteID + "' data-index='" + index + "'>Save Note</button>");

          if (data.note.length != index) {
            $("." + index + "noteArea" + data._id).append("<button class='green darken-3 z-depth-5 right btn deletenote' data-id='" + data._id + "' data-note='" + noteID + "' data-index='" + index + "'>Delete Note</button>");
          }

          if (data.note[index]) {
            $(".titleinput" + [index]).val(data.note[index].title);
            $(".bodyinput" + [index]).val(data.note[index].body);
          }

        }
      });
  } else {
    // Ajax call for the Article to display notes
    $.ajax({
        method: "GET",
        url: "/api/articles/" + thisId
      })
      .then(function (data) {
        console.log(data);
        $(".note" + data._id).append("<h2 class='center'>" + data.title + "</h2>");

        for (let index = 0; index < (data.note.length + 1); index++) {
          var noteID = -1;
          if (data.note[index]) {
            noteID = data.note[index]._id;
          }
          $(".note" + data._id).append("<div class='noteArea col m4 " + index + "noteArea" + data._id + "'></div>");
          $("." + index + "noteArea" + data._id).append("<h2 class='center'> Note #" + (index + 1) + "</h2>");
          $("." + index + "noteArea" + data._id).append("<input class='titleinput" + [index] + "' name='title' style='background-color: #FCF5C7; border: 2px solid black'>");
          $("." + index + "noteArea" + data._id).append("<textarea class='bodyinput" + [index] + "' name='body' style='background-color: #FCF5C7; border: 2px solid black'></textarea>");
          $("." + index + "noteArea" + data._id).append("<button class='red darken-4 z-depth-5 left btn savenote' data-id='" + data._id + "' data-note='" + noteID + "' data-index='" + index + "'>Save Note</button>");

          if (data.note.length != index) {
            $("." + index + "noteArea" + data._id).append("<button class='green darken-3 z-depth-5 right btn deletenote' data-id='" + data._id + "' data-note='" + noteID + "' data-index='" + index + "'>Delete Note</button>");
          }

          if (data.note[index]) {
            $(".titleinput" + [index]).val(data.note[index].title);
            $(".bodyinput" + [index]).val(data.note[index].body);
          }

        }
      });
  }

});

// On click to save article to the database
$(document).on("click", ".saveArticle", function () {
  var thisId = $(this).attr("data-id");

  $.ajax({
      method: "GET",
      url: "/api/articles/save/" + thisId,
    })
    .then(function (data) {
      console.log(data);
      $(".notes").empty();
    });

});

// On click to delete articles from the database
$(document).on("click", ".deleteArticle", function () {
  var thisId = $(this).attr("data-id");

  $.ajax({
      method: "DELETE",
      url: "/api/articles/" + thisId,
    })
    .then(function (data) {
      console.log(data);
      $(".article" + thisId).remove();
      $(".notes").empty();
    });

  // TODO: Have a saved message for confirmation!

});


//TODO: /articles/scraped
// On click to delete articles from the database
$(document).on("click", ".deleteAll", function () {

  $.ajax({
      method: "get",
      url: "/api/del",
    })
    .then(function (data) {
      console.log(data);
      window.location.href("/");
      window.location.reload();
    });

});

// On click to delete articles from the database
$(document).on("click", ".deleteSavedArticle", function () {
  var thisId = $(this).attr("data-id");

  $.ajax({
      method: "DELETE",
      url: "/api/articles/saved/" + thisId,
    })
    .then(function (data) {
      console.log(data);
      $(".article" + thisId).remove();
      $(".notes").empty();
    });

  // TODO: Have a saved message for confirmation!

});

// On click to save unsaved article notes to the database
$(document).on("click", ".savenote", function () {
  var thisId = $(this).attr("data-id");
  var thisNote = $(this).attr("data-note");
  var thisIndex = $(this).attr("data-index");

  $.ajax({
      method: "POST",
      url: "/api/articles/" + thisId + "/" + thisNote,
      data: {
        title: $(".titleinput" + thisIndex).val(),
        body: $(".bodyinput" + thisIndex).val()
      }
    })
    .then(function (data) {
      console.log(data);
      $(".notes").empty();
    });

});

// On click to save SAVED article notes to the database
$(document).on("click", ".savenote", function () {
  var thisId = $(this).attr("data-id");
  var thisNote = $(this).attr("data-note");
  var thisIndex = $(this).attr("data-index");

  $.ajax({
      method: "POST",
      url: "/api/articles/saved/" + thisId + "/" + thisNote,
      data: {
        title: $(".titleinput" + thisIndex).val(),
        body: $(".bodyinput" + thisIndex).val()
      }
    })
    .then(function (data) {
      console.log(data);
      $(".notes").empty();
    });

});

// On click to delete notes from the database
$(document).on("click", ".deletenote", function () {
  var thisId = $(this).attr("data-id");
  var thisNote = $(this).attr("data-note");

  $.ajax({
      method: "DELETE",
      url: "/api/articles/" + thisId + "/" + thisNote,
    })
    .then(function (data) {
      console.log(data);
      $(".notes").empty();
    });

  // TODO: Have a saved message for confirmation!

});