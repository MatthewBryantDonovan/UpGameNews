// Grab the articles as a JSON an populate the page with them
$.getJSON("/articles", function (data) {
  for (var i = 0; i < data.length; i++) {
    $("#articles").append("<div class='borderBox row article" + data[i]._id + "'>" +
      "<a class='' href='https://www.gamespot.com" + data[i].link + "' target='_blank' >" +
      "<img class='col m3 articleImg' src='" + data[i].img + "'></a>" +
      "<p class='col m9 articleTitle' data-id='" + data[i]._id + "'>" + data[i].title + "</p><br /><br />" +
      "<p class='col m12' data-id='" + data[i]._id + "'>" + data[i].summary + "</p>" +
      "<button class='left btn articleBtn deleteArticle' data-id='" + data[i]._id + "'>Delete article</button>" +
      "<button class='right btn articleBtn saveArticle' data-id='" + data[i]._id + "'>Save article</button>" +
      "</div><div class='row notes note" + data[i]._id + "'></div>");
  }
});


// On click to display notes
$(document).on("click", "p", function () {
  $(".notes").empty();
  var thisId = $(this).attr("data-id");
  var isSaved = $(this).attr("data-saved");
  console.log(isSaved);

  if (isSaved) {
    // Ajax call for the Article to display notes
    $.ajax({
        method: "GET",
        url: "/articles/saved/" + thisId
      })
      .then(function (data) {
        console.log(data._id);
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
          $("." + index + "noteArea" + data._id).append("<button class='left btn savenote' data-id='" + data._id + "' data-note='" + noteID + "' data-index='" + index + "'>Save Note</button>");

          if (data.note.length != index) {
            $("." + index + "noteArea" + data._id).append("<button class='right btn deletenote' data-id='" + data._id + "' data-note='" + noteID + "' data-index='" + index + "'>Delete Note</button>");
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
        url: "/articles/" + thisId
      })
      .then(function (data) {
        console.log(data._id);
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
          $("." + index + "noteArea" + data._id).append("<button class='left btn savenote' data-id='" + data._id + "' data-note='" + noteID + "' data-index='" + index + "'>Save Note</button>");

          if (data.note.length != index) {
            $("." + index + "noteArea" + data._id).append("<button class='right btn deletenote' data-id='" + data._id + "' data-note='" + noteID + "' data-index='" + index + "'>Delete Note</button>");
          }

          if (data.note[index]) {
            $(".titleinput" + [index]).val(data.note[index].title);
            $(".bodyinput" + [index]).val(data.note[index].body);
          }

        }
      });
  }

});

// On click show current articles
$(document).on("click", ".currentArticles", function () {
  $("#articles").empty();
  $.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
      $("#articles").append("<div class='borderBox row article" + data[i]._id + "'>" +
        "<a class='' href='https://www.gamespot.com" + data[i].link + "' target='_blank' >" +
        "<img class='col m3 articleImg' src='" + data[i].img + "'></a>" +
        "<p class='col m9 articleTitle' data-id='" + data[i]._id + "'>" + data[i].title + "</p><br /><br />" +
        "<p class='col m12' data-id='" + data[i]._id + "'>" + data[i].summary + "</p>" +
        "<button class='left btn articleBtn deleteArticle' data-id='" + data[i]._id + "'>Delete article</button>" +
        "<button class='right btn articleBtn saveArticle' data-id='" + data[i]._id + "'>Save article</button>" +
        "</div><div class='row notes note" + data[i]._id + "'></div>");
    }
    $(".notes").empty();
  });
});

// On click show saved articles
$(document).on("click", ".savedArticles", function () {
  $.ajax({
      method: "GET",
      url: "/articles/saved",
    })
    .then(function (data) {
      $("#articles").empty();
      console.log(data);

      for (var i = 0; i < data.length; i++) {
        $("#articles").append("<div class='borderBox row article" + data[i]._id + "'>" +
          "<a class='' href='https://www.gamespot.com" + data[i].link + "' target='_blank' >" +
          "<img class='col m3 articleImg' src='" + data[i].img + "'></a>" +
          "<p class='col m9 articleTitle' data-saved='true' data-id='" + data[i]._id + "'>" + data[i].title + "</p><br /><br />" +
          "<p class='col m12' data-saved='true' data-id='" + data[i]._id + "'>" + data[i].summary + "</p>" +
          "<button class='left btn articleBtn deleteSavedArticle' data-id='" + data[i]._id + "'>Delete article</button>" +
          "</div><div class='row notes note" + data[i]._id + "'></div>");
      }
      $(".notes").empty();
    });

});

// On click to save article to the database
$(document).on("click", ".saveArticle", function () {
  var thisId = $(this).attr("data-id");

  $.ajax({
      method: "GET",
      url: "/articles/save/" + thisId,
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
      url: "/articles/" + thisId,
    })
    .then(function (data) {
      console.log(data);
      $(".article" + thisId).remove();
      $(".notes").empty();
    });

  // TODO: Have a saved message for confirmation!

});

// On click to delete articles from the database
$(document).on("click", ".deleteSavedArticle", function () {
  var thisId = $(this).attr("data-id");

  $.ajax({
      method: "DELETE",
      url: "/articles/saved/" + thisId,
    })
    .then(function (data) {
      console.log(data);
      $(".article" + thisId).remove();
      $(".notes").empty();
    });

  // TODO: Have a saved message for confirmation!

});

// On click to save notes to the database
$(document).on("click", ".savenote", function () {
  var thisId = $(this).attr("data-id");
  var thisNote = $(this).attr("data-note");
  var thisIndex = $(this).attr("data-index");

  $.ajax({
      method: "POST",
      url: "/articles/" + thisId + "/" + thisNote,
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
      url: "/articles/" + thisId + "/" + thisNote,
    })
    .then(function (data) {
      console.log(data);
      $(".notes").empty();
    });

  // TODO: Have a saved message for confirmation!

});