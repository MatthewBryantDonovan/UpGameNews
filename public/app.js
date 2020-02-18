// Grab the articles as a JSON an populate the page with them
$.getJSON("/articles", function (data) {
  for (var i = 0; i < data.length; i++) {
    $("#articles").append("<div class='borderBox'><a href='https://www.gamespot.com" + data[i].link + "' target='_blank' ><img src='" + data[i].img + "'></a><p data-id='" + data[i]._id + "'>" + data[i].title + "<br /><br />" + data[i].summary + "</p></div>");
  }
});


// On click to display notes
$(document).on("click", "p", function () {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  // Ajax call for the Article to display notes
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    .then(function (data) {
      console.log(data);

      for (let index = 0; index < (data.note.length+1); index++) {
        var noteID = -1;
        if (data.note[index]){
          noteID = data.note[index]._id;
        }
        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<input id='titleinput" + [index] + "' name='title' >");
        $("#notes").append("<textarea id='bodyinput" + [index] + "' name='body'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "' data-note='" + noteID + "' data-index='" + index + "' id='savenote'>Save Note</button>");

        if (data.note[index]) {
          $("#titleinput" + [index]).val(data.note[index].title);
          $("#bodyinput" + [index]).val(data.note[index].body);
        }

      }
    });
});

// On click to save notes to the database
$(document).on("click", "#savenote", function () {
  var thisId = $(this).attr("data-id");
  var thisNote = $(this).attr("data-note");
  var thisIndex = $(this).attr("data-index");

  $.ajax({
      method: "POST",
      url: "/articles/" + thisId + "/" + thisNote,
      data: {
        title: $("#titleinput" + thisIndex).val(),
        body: $("#bodyinput" + thisIndex).val()
      }
    })
    .then(function (data) {
      console.log(data);
      $("#notes").empty();
    });

    // TODO: Have a saved message for confirmation!

});