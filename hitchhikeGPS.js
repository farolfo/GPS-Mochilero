
function initialize() {

  $('.confirm-add-hitchhike').click(function() {
    var reqBody = {
      "lat": currentPosition.coords.latitude,
      "long": currentPosition.coords.longitude
    };

    $.ajax({
      url:"https://mochilero-api.herokuapp.com/hitchs",
      type:"POST",
      data: JSON.stringify(reqBody),
      contentType:"application/json",
      success: function() {
        $('#addHitchhikeConfirm').modal('toggle');
        bootstrapAlert.success('Hitchhike location saved! Thanks for contributing!');
      },
      error: function() {
        $('#addHitchhikeConfirm').modal('toggle');
        bootstrapAlert.success('There was an error while saving the location');
      }
    });
  });
}
