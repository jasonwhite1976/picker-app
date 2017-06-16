$(document).ready(function() {
  $("#delete-btn").click(function(event) {
      if( !confirm('Are you sure?') )
          event.preventDefault();
  });

  $(".delete-list-link").click(function(event) {
      if( !confirm('Are you sure?') )
          event.preventDefault();
  });

  $('#addItemButton').click(addItemSubmit);

  function addItemSubmit (event) {

      event.preventDefault();
      event.stopPropagation();

      var listURL = window.location.href.split("/").pop();
      console.log('listURL = ' + listURL);

      var newItem = addItemForm.itemName.value;

      $.ajax({
        url: '/account/list/additem/' + listURL,
        type: 'POST',
        dataType: "json",
        contentType: 'application/json',
        data: JSON.stringify ({
          name: newItem
        }),
        success: function() {
          //$("#log").html( newItem );
          location.reload();
        }
      });
    }

    $(".pick-toggle").click(function(event) {
      $(this).toggleClass( "not-got-it" );
      var hiddenField = $('.isPickedInput');
      val = hiddenField.val();
      hiddenField.val(val === "1" ? "0" : "1");
    });

    $('.updateItemForm').click(updateItemForm);

    function updateItemForm (event) {

        event.preventDefault();
        event.stopPropagation();

        var listURL = window.location.href.split("/").pop();
        console.log('listURL = ' + listURL);

        var itemName = $(this).find('.name').val();
        var isPicked = $(this).find('.isPickedInput').val();
        var timeId   = $(this).find('.timeStampId').val();

        //var itemName  = updateItemForm.itemName.value;
        //var isPicked = updateItemForm.isPickedInput.value;
        isPicked = parseInt(isPicked);
        //var timeId = updateItemForm.timeStampId.value;
        console.log('itemName = ' + itemName);
        console.log('isPicked = ' + isPicked);
        console.log('timeId = ' + timeId);

        $.ajax({
          url: '/account/list/itempicked/' + listURL,
          type: 'POST',
          dataType: "json",
          contentType: 'application/json',
          data: JSON.stringify ({
            name: itemName,
            picked: isPicked,
            timeStampId: timeId
          }),
          success: function() {
            location.reload();
          }
        });
    }

});
