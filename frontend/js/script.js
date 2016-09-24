var getDiscountValue(percent, price) {
	return price * percent;
};

var getTotal(price, discount) {
	return price - discount;
};

var formatDiscount(discount) {
	return (discount * 100).toFixed(2) + "%";
}

var formatAmount(amount) {
	return "£" + (amount).toFixed(2);
}

var getOrder = function(data) {

    	$("#ordered-item").text(data.item);
    	$("#ordered-qty").text(data.quantity);
    	$("#ordered-price").text(data.price);
    	$("#discount-percent").text("");
    	$("#discount-title").text("");
    	$("#discount-amount").text("");
    	$("#price-final").text(data.price);

        $("#myModal").modal();
        console.log(data);
};

var getCharacteristics = function(data) {
		var price = parseFloat($());
		var discount = parseFloat(data.discount);
		var discountAmount = getDiscountValue(discount, price);
		var total = getTotal(price, discount);

    	$("#discount-percent").text(formatDiscount(discount));
    	$("#discount-title").text("Lady's night");
    	$("#discount-amount").text(formatAmount(discountAmount));
    	$("#price-final").text(formatAmount(total));
        $("#myModal").modal();

        console.log(data);
};

var insertItem = function(data) {
    var template =         '<div class="row item" id="item<<ORDER_ID>>">' +
            '<div class="col s12">' +
                '<div class="col s2">' +
                    '<div id="tableNumber<<ORDER_ID>>">#<<TABLE_NUMBER>></div>' +
                '</div>' +
                '<div class="col s2">' +
                    '<div id="paid<<ORDER_ID>>"><img src="img/wallet.png" height="35"' + 'width="35" /></div>' +
                '</div>' +
                '<div class="col s2">' +
                    '<div id="age<<ORDER_ID>>"><img src="img/18.png" height="35" ' + 'width="35" /></div>' +
                '</div>' +
                '<div class="col s3">' +
                    '<div id="server<<ORDER_ID>>">Saci</div>' +
                '</div>' +
                '<div class="col s1">
                    '<div id="amount<<ORDER_ID>>">4</div>' +
                '</div>' +
                '<div class="col s2">' +
                    '<div id="price<<ORDER_ID>>">£26.55</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    
    

}

var socket = io.connect('http://localhost:4200');
        socket.on('connect', function(data) {
            socket.emit('join', 'Hello World from client');
        });
        
        socket.on('messages', function(data) {
                console.log(data);
        });

        socket.on('order', function(data) {
                getOrder(data);
        });

        socket.on('characteristics', function(data) {
        	getCharacteristics(data);
        })

$('#process-button').on('click', function() {
	$("#myModal").modal('hide');
	//send message to back end
	socket.emit('approve', 'Get the people what they want');
    console.log('approve');
});

//Does fluid credit card number input
$('.input-card-number').on('keyup change', function() {
  t = $(this);
  
  //focuses next input when the fourth number is put in
  if (t.val().length > 3) {
    t.next().focus();
  }
});

var $animation_elements = $('.animation-element');
var $window = $(window);

//On scroll into view animatior
//Used to drop credit card on receipt
function check_if_in_view() {
  var window_height = $window.height();
  var window_top_position = $window.scrollTop();
  var window_bottom_position = (window_top_position + window_height);

  $.each($animation_elements, function() {
    var $element = $(this);
    var element_height = $element.outerHeight();
    var element_top_position = $element.offset().top;
    var element_bottom_position = (element_top_position + element_height);

    //check to see if this current container is within viewport
    if ((element_bottom_position >= window_top_position) &&
      (element_top_position <= window_bottom_position)) {
      $element.addClass('in-view');
    } else {
      $element.removeClass('in-view');
    }
  });
}

$window.on('scroll resize', check_if_in_view);
$window.trigger('scroll');