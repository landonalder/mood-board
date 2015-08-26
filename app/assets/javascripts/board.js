//= require jquery-ui/draggable

$(function () {

  // Generate the mood attributes
  function getMoodForImage(img) {
    return {
      "top":$(img).position().top.toString(),
      "left":$(img).position().left.toString(),
    };
  };

  function updateMood(currentTile, moodInfo) {
    $.ajax({
      context: currentTile,
      type:"POST",
      url:"/users/" + $(currentTile).attr('id') + "/moods",
      data:JSON.stringify(moodInfo),
      contentType:'application/json',
      dataType:'json',
    })
  }

  // Intialize bootstrap popover
  $("img").popover({
    html: true,
    placement: "auto top",
    delay: {show: 200, hide: 100}
  });

  // Make popover disapear if anywhere on the board is clicked
  $("#board").click(function() {
    $(".popover").popover("hide");
  });

  // Do not disappear if click is within the popover
  $("img").on("shown.bs.popover", function() {
    $(".popover").click(function(event) {
      event.stopPropagation();
    });
  });

  $("img").on("show.bs.popover", function() {
    $(this).unbind("hide.bs.popover");
    $(this).on("hide.bs.popover", function() {
      if($(".popover-content").children("textarea").length !== 0) {
        var moodInfo = getMoodForImage($(this));
        moodInfo["status"] = $(".popover-content").children("textarea").val();
        updateMood($(this), moodInfo);

        // Update client-side popup to new status value
        var textarea = $($.parseHTML($(this).data("content")));
        textarea.text(moodInfo["status"]);
        $(this).attr("data-content", textarea.prop("outerHTML"));
      }
    });
  });

  // Append the draggable widget to all the img objects
  var current_user_image_query;
  if($("#user").text()) {
    current_user_image_query = "img#" + $("#user").text();
  } else {
    current_user_image_query = "img";
  }

  $(current_user_image_query).draggable({
    containment: "#board",
    // Capture the "stop drag" event
    stop:function (event, ui) {
      // Update border color to green
      $(this).removeClass("green orange red").addClass("green")
      updateMood($(this), getMoodForImage($(this)));
    }
  });
});