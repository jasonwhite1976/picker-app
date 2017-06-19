$(document).ready(function() {
  $("#delete-btn").click(function(event) {
      if( !confirm('Are you sure?') )
          event.preventDefault();
  });

  $(".delete-list-link").click(function(event) {
      if( !confirm('Are you sure?') )
          event.preventDefault();
  });
/*
  if($(".isPickedInput").val() == "0"){
      $(".pick-toggle").removeClass("green-text");
      $(".pick-toggle").addClass("not-got-it");
  }
  if($(".isPickedInput").val() == "1"){
      $(".pick-toggle").addClass("green-text");
      $(".pick-toggle").removeClass("not-got-it");
  }
*/
  /*******************************************************/

  $('#addItemButton').click(addItemSubmit);
  function addItemSubmit (event) {

      event.preventDefault();
      event.stopPropagation();

      var listURL = window.location.href.split("/").pop();
      console.log('listURL = ' + listURL);

      var newItem = addItemForm.itemName.value;

      $.ajax({
        url: '/list/additem/' + listURL,
        type: 'POST',
        dataType: "json",
        contentType: 'application/json',
        data: JSON.stringify ({
          name: newItem
        }),
        success: function() {
          location.reload();
        }
      });
    }

    /*******************************************************/

      $('.deleteItemForm').click(deleteItemForm);
      function deleteItemForm (event) {
          event.preventDefault();
          event.stopPropagation();

          var listURL = window.location.href.split("/").pop();
          console.log('listURL = ' + listURL);

          var item_id = $(this).find('.itemId').val();

          console.log('_id ' + item_id);

          $.ajax({
            url: '/list/deleteitem/' + listURL,
            type: 'POST',
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify ({
              _id: item_id
            }),
            success: function() {
              location.reload();
            }
          });
        }

    /*******************************************************/

    // jquery selector problem - use this to target the correct element?

    $(".pick-toggle").click(function(){
       var hiddenField = $(this).siblings(".isPickedInput");
       var val = hiddenField.val();
       hiddenField.val(val === "1" ? "0" : "1");
       console.log(hiddenField);
    });
    /*
    $(".pick-toggle").click(function(event) {
      var hiddenField = $('.isPickedInput');
      val = hiddenField.val();
      hiddenField.val(val === "1" ? "0" : "1");
    });
*/
    $('.updateItemForm').click(updateItemForm);
    function updateItemForm (event) {
        event.preventDefault();
        event.stopPropagation();

        var listURL = window.location.href.split("/").pop();
        console.log('listURL = ' + listURL);

        var itemName = $(this).find('.name').val();
        var isPicked = $(this).find('.isPickedInput').val();
        var item_id =  $(this).find('.itemId').val();


        var timeId   = $(this).find('.timeStampId').val();
        isPicked = parseInt(isPicked);

        console.log('itemName = ' + itemName);
        console.log('isPicked = ' + isPicked);

        $.ajax({
          url: '/list/itempicked/' + listURL,
          type: 'POST',
          dataType: "json",
          contentType: 'application/json',
          data: JSON.stringify ({
            name: itemName,
            picked: isPicked,
            item_id: item_id
          }),
          success: function() {
            location.reload();
          }
        });
    }

});
