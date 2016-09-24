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

var getOrder = function(data) {
        insertItem(data);
		console.log("get order")
        
        if (data.id % 5 == 0) {
            console.log("adding item one modal");
            $("#item1").click(function() {
                    $("#myModal").modal();
            });

			var unitprice = parseFloat(data.price);
			var quantity = parseFloat(data.quantity);
			orderPrice = getOrderPrice(unitprice, quantity);

	    	updateContent("#ordered-item", data.item);
	    	updateContent("#ordered-qty", data.quantity);
	    	updateContent("#ordered-price", formatAmount(orderPrice));

	    	$("#discount-percent").text("");
	    	$("#discount-title").text("");
	    	$("#discount-amount").text("");
	    	updateContent("#price-final", formatAmount(orderPrice));

        $("#myModal").modal();

        }
 
        console.log(data);
};

var getCharacteristics = function(data) {
		console.log("Get characteristics");

        $("#age" + data.id).html('<img src="img/tick-black.png" height="35" "width="35" />');
        //updateHtml("#age" + data.id, '<img src="img/tick-black.png" height="35" "width="35" />');
    	if (data.id % 5 == 0) {
    		var discount = parseFloat(data.discount);
			var discountAmount = getDiscountValue(discount, orderPrice);
			var total = getTotal(orderPrice, discountAmount);

	    	updateContent("#discount-percent", formatDiscount(discount));
	    	updateContent("#discount-title", "Lady's Night Discount");
	    	updateContent("#discount-amount", formatAmount(discountAmount));
	    	updateContent("#price-final", formatAmount(total));

    	}
		

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

        console.log(data);
};

var getPaymentStatus = function(data) {
	if (data.status == "OK") {

		$("#payment-check").empty();
    	$("#payment-check").append('<img src="img/tick.png" alt="OK">').fadeIn(500);

        $("#paid" + data.id).html('<img src="img/tick-black.png" height="35" "width="35" />');

		paymentStatusOK = true;
		if (ageStatusOK == true) {
			$('#process-button').removeClass('disabled');
		}
	} else {
		//TODO: red X image
	}
};

var insertItem = function(data) {
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
    
    var price = formatAmount((data.quantity * data.price)/100);
    
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
    
    //$(".container").append(filled).last().hide().fadeIn();
    $('<div class="row item"></div>').appendTo(".container").hide().append(filled).fadeIn('slow');
};

var socket = io.connect('http://localhost:4200');
        socket.on('connect', function(data) {
            socket.emit('join', 'Hello World from client');

	        console.log("check");
	        setTimeout(function(){
	           	socket.emit('buy', { number: 1, type: 'beer' });
	       	}, 3000);
            
	        setTimeout(function(){
	           	socket.emit('buy', { number: 1, type: 'beer' });
	       	}, 6000);
            
	        setTimeout(function(){
	           	socket.emit('buy', { number: 1, type: 'beer' });
	       	}, 8000);

	        setTimeout(function(){
	           	socket.emit('buy', { number: 1, type: 'beer' });
	       	}, 16000);

	        setTimeout(function(){
	           	socket.emit('buy', { number: 1, type: 'beer' });
	       	}, 10000);

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