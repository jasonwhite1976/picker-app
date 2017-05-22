$(document).ready(function() {
  $("#delete-btn").click(function() {
      if(confirm("Are you sure?")) {
        document.forms[0].submit();
      } else {
        return false;
      }
    });
});
