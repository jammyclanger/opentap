var getOrder = function() {
	$.ajax({
	    'url' : 'localhost:3000/quynh&callback=?',
	    'type' : 'GET',
	    'success' : function(data) {
	      if (data == "success") {
	        
	        $(".beer").text = "2";

	      }
	    }
	  });
};