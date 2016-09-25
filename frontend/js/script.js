var getDiscountValue = function(percent, price) {
	return price * percent;
};

var getOrderPrice = function(unitprice, quantity) {
	return unitprice * quantity / 100;
}

var getTotal = function(price, discount) {
	return price - discount;
};

var formatDiscount = function(discount) {
	return (discount * 100).toFixed(0) + "%";
};

var formatAmount = function(amount) {
	return "£" + (amount).toFixed(2);
};

var updateContent = function(myDiv, content) {
	$(myDiv).fadeOut('slow', function() {
    	$(myDiv).text(content);
    	$(myDiv).fadeIn('slow');
   	});
};


var orderPrice;
var ageStatusOK = false;
var paymentStatusOK = false;
var allOrders = [];

var getOrder = function(data) {
		
        var thisOrder = {
        	quantity: data.quantity, 
        	item: data.item,
        	price: data.price,
        	table: data.table,
            tender: data.tender,
            id: data.id,
            paid: false
        };

        allOrders[data.id] =  thisOrder;  
        insertItem(data);

   //      if (data.id % 2 == 0) {
   //          console.log("adding item one modal");
   //          $("#item1").click(function() {
   //                  $("#myModal").modal();
   //          });

			// var unitprice = parseFloat(data.price);
			// var quantity = parseFloat(data.quantity);
			// orderPrice = getOrderPrice(unitprice, quantity);

	  //   	updateContent("#ordered-item", data.item);
	  //   	updateContent("#ordered-qty", data.quantity);
	  //   	updateContent("#ordered-price", formatAmount(orderPrice));
	  //   	updateContent("#order-id", data.table);

	  //   	$("#discount-percent").text("");
	  //   	$("#discount-title").text("");
	  //   	$("#discount-amount").text("");
	  //   	updateContent("#price-final", formatAmount(orderPrice));

   //      $("#myModal").modal();

   //      }
 
   //      console.log(data);
};


var getCharacteristics = function(data) {
		console.log("Get characteristics");

        $("#age" + data.id).html('<img src="img/tick-black.png" height="35" "width="35" />');

		var discount = parseFloat(data.discount);
		var discountAmount = getDiscountValue(discount, orderPrice);
		var total = getTotal(orderPrice, discountAmount);

		var thisOrder = allOrders[data.id];
		thisOrder.age = "OK";
		thisOrder.discount = data.discount;
		allOrders[data.id] = thisOrder;

		console.log('orderid: ' + $('#order-id').text());
		console.log($('#myModal').hasClass('in'));

		if ($('#myModal').hasClass('in') && $('#magicId').text() == data.id) {
			console.log('updating discount');
			updateContent("#discount-percent", formatDiscount(discount));
	    	updateContent("#discount-title", "Paytastic Hackathon Discount");
	    	updateContent("#discount-amount", formatAmount(discountAmount));
	    	updateContent("#price-final", formatAmount(total));
            updateContent("#price" + data.id, formatAmount(total));
			
	    	var ageStatus = data.age;
	    	if (ageStatus == "OK") {
	    		$("#age-check").empty();
	    		$("#age-check").append('<img src="img/tick.png" alt="OK">').fadeIn(500);
	    		ageStatusOK = true;
	    		if (paymentStatusOK == true) {
	    			$('#process-button').removeClass('disabled');
	    		}
	    	} else {
	    		//TODO ERROR
	    	}
		}

        console.log(data);
};

var buy = function() {
    globalSocket.emit('buy', { number: 1, type: 'beer' });
}

var getPaymentStatus = function(data) {
	if (data.status == "OK") {
        
        allOrders[data.id].paid = true;

        if ($('#myModal').hasClass('in') && $('#magicId').text() == data.id) {
    	   $("#payment-check").html('<img src="img/tick.png" alt="OK">').fadeIn(500);
        }
            
        $("#paid" + data.id).html('<img src="img/tick-black.png" height="35" "width="35" />');

		paymentStatusOK = true;
		if (ageStatusOK == true) {
			$('#process-button').removeClass('disabled');
		}
	} else {
		//TODO: red X image
	}
};

var insertItem = function(incoming) {
    var template =         '<div id="item<<ORDER_ID>>">' +
            '<div class="col s12">' +
                '<div class="col s2">' +
                    '<div id="tableNumber<<ORDER_ID>>">#<<TABLE_NUMBER>></div>' +
                '</div>' +
                '<div class="col s2">' +
                    '<div id="paid<<ORDER_ID>>"><img src="img/wallet.png" height="35" width="35" /></div>' +
                '</div>' +
                '<div class="col s2">' +
                    '<div id="age<<ORDER_ID>>"><img src="img/18.png" height="35" width="35" /></div>' +
                '</div>' +
                '<div class="col s3">' +
                    '<div id="server<<ORDER_ID>>"><<TENDER>></div>' +
                '</div>' +
                '<div class="col s1">' +
                    '<div id="amount<<ORDER_ID>>"><<QUANTITY>></div>' +
                '</div>' +
                '<div class="col s2">' +
                    '<div id="price<<ORDER_ID>>"><<PRICE>></div>' +
                '</div>' +
            '</div>' +
        '</div>';
    var data = allOrders[incoming.id];
    
    var price = "£3.85";
    
    console.log(JSON.stringify(data));
    var filled = template.replace("<<ORDER_ID>>", data.id);
    filled = filled.replace("<<ORDER_ID>>", data.id);
    filled = filled.replace("<<ORDER_ID>>", data.id);
    filled = filled.replace("<<ORDER_ID>>", data.id);
    filled = filled.replace("<<ORDER_ID>>", data.id);
    filled = filled.replace("<<ORDER_ID>>", data.id);
    filled = filled.replace("<<ORDER_ID>>", data.id);
    filled = filled.replace("<<ORDER_ID>>", data.id);
    filled = filled.replace("<<TABLE_NUMBER>>", data.table);
    filled = filled.replace("<<TENDER>>", data.tender);
    filled = filled.replace("<<QUANTITY>>", data.quantity);
    filled = filled.replace("<<PRICE>>", price);
    
    $('<div class="row item"></div>').appendTo(".container").hide().append(filled).fadeIn('slow');
    $('#item' + data.id).on('click', function() {
    	var thisOrder = allOrders[data.id];

    	var unitprice = parseFloat(thisOrder.price);
		var quantity = parseFloat(thisOrder.quantity);
		orderPrice = getOrderPrice(unitprice, quantity);

    	updateContent("#ordered-item", thisOrder.item);
    	updateContent("#ordered-qty", thisOrder.quantity);
    	updateContent("#ordered-price", formatAmount(orderPrice));
    	updateContent("#order-id", thisOrder.table);
        updateContent("#magicId", thisOrder.id);

    	$("#discount-percent").text("");
    	$("#discount-title").text("");
    	$("#discount-amount").text("");
    	updateContent("#price-final", formatAmount(orderPrice));
        
        console.log("going to add age");
        if (thisOrder.age != null) {
            if (thisOrder.age == "OK") {
                console.log("adding age ok");
                $("#age-check").html('<img src="img/tick.png" alt="OK">');
            } else {
                console.log("adding age not ok");
                $("#age-check").html('<div class="line"></div><div class="line"></div><div class="line"></div>');
            }
        } else {
                $("#age-check").html('<div class="line"></div><div class="line"></div><div class="line"></div>');
        }

        console.log("going to add paid");
        if (!thisOrder.paid) {
                console.log("adding paid not ok");
                $("#payment-check").html('<div class="line"></div><div class="line"></div><div class="line"></div>');
        } else {
                console.log("adding paid ok");
                $("#payment-check").html('<img src="img/tick.png" alt="OK">');
        }
        
        $("#myModal").modal();

    });

};

var socket = io.connect('http://localhost:4200');
        globalSocket = socket;
        socket.on('connect', function(data) {
            socket.emit('join', 'Hello World from client');

	        console.log("check");
        });
        
        socket.on('messages', function(data) {
                console.log(data);
        });

        socket.on('order', function(data) {
                getOrder(data);
        });

        socket.on('characteristic', function(data) {
        	getCharacteristics(data);
        });

        socket.on('payment', function(data) {
        	getPaymentStatus(data);
        });

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