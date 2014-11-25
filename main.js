	var map = {};

$(document).ready(function()
	{
// stellar.js setup
		$(window).stellar();
        var links = $('.navigation').find('li');
        slide = $('.slide');
        button = $('.next-btn');
        mywindow = $(window);
        htmlbody = $('html,body');
// ----------------------------------------------

// waypoints plugin setup
		slide.waypoint(function (event, direction) {
			dataslide = $(this).attr('data-slide');
//If the user scrolls up change the navigation link that has the same data-slide attribute as the slide to active and 
//remove the active class from the previous navigation link 
			if (direction === 'down') {
				$('.navigation li[data-slide="' + dataslide + '"]').addClass('active').prev().removeClass('active');
			}
// else If the user scrolls down change the navigation link that has the same data-slide attribute as the slide to active and 
//remove the active class from the next navigation link
			else {
				$('.navigation li[data-slide="' + dataslide + '"]').addClass('active').next().removeClass('active');
			}
		});
		
		mywindow.scroll(function() {
			if (mywindow.scrollTop() == 0) {
				$('.navigation li[data-slide="1"]').addClass('active');
				$('.navigation li[data-slide="2"]').removeClass('active');
			}
		});
		
		function goToByScroll(dataslide) {
			htmlbody.animate({
				scrollTop: $('.slide[data-slide="' + dataslide + '"]').offset().top
			}, 2000, 'easInOutQuint');
		}
		
		links.click(function (e){
			e.preventDefault();
			dataslide = $(this).attr('data-slide');
			goToByScroll(dataslide);	
		});
		
		button.click(function (e){
			e.preventDefault();
			dataslide = $(this).attr('data-slide');
			goToByScroll(dataslide);
		});
		
		var carquery = new CarQuery();
		var base_url = carquery.base_url;

//	Initialize the CarQuery API	
		carquery.init()
		carquery.setFilters( {sold_in_us:true});
		carquery.initYearMakeModelTrim('year', 'make', 'model', 'trim');

//   Initialize the Google Maps API	
		var mapOptions = {
			zoom: 8,
			center: new google.maps.LatLng(29.9966514, -97.80688509999999),
			mapTypeId: google.maps.MapTypeId.ROADMAP
	};
//	Create the Map Canvas on the Page
		map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

//Set up the Location Autocomplete Using Google Geocode
		var acoptions = {
			types: ['geocode'],
			componentRestrictions: {country: 'us'}
		};
		pickup = new google.maps.places.Autocomplete(document.getElementById('pickup'), acoptions);
		dropoff = new google.maps.places.Autocomplete(document.getElementById('dropoff'), acoptions);
		
		google.maps.event.addListener(pickup, 'place_changed', function() {
				map.setCenter(pickup.getPlace().geometry.location);
			});
		
//	Get Distance Button Clicked	
		$('#get-distance').click(function()
		{
			var getOriginZip = $('#pickup').val();
			var getDestinationZip = $('#dropoff').val();
			var OriginZip = new Array(getOriginZip);
			var DestinationZip = new Array(getDestinationZip);
			console.log("Center Map on " + getOriginZip);
			centerMap(getOriginZip);
			
			function centerMap(address){
				var geo = new google.maps.Geocoder;
				
				geo.geocode({'address': address}, function(res, status){
					if(status == google.maps.GeocoderStatus.OK) {
						var Lat = res[0].geometry.location.lat();
						var Lng = res[0].geometry.location.lng();
						console.log("Lat ", Lat, ", Lng ", Lng)
						
						var newLatLng = new google.maps.LatLng(Lat, Lng);
						console.log("newLatLng is " + newLatLng);
						var marker = new google.maps.Marker({
							position: newLatLng,
							map: map});
						map.setCenter(newLatLng, 5);
					} else {
						alert("Geocode was not successful: " + status)
					}
					});
			}
			console.log(typeof(getOriginZip));
			/*console.log(getLatLong(getOriginZip));*/

			var output           = '<tr><th scope="col">From</th><th scope="col">To</th><th scope="col">Miles</th><th scope="col">Est. Time</th></tr>';
			
			var service = new google.maps.DistanceMatrixService();
			service.getDistanceMatrix({
				origins:		OriginZip,
				destinations:	DestinationZip,
				travelMode:		google.maps.TravelMode.DRIVING,
				unitSystem:		google.maps.UnitSystem.IMPERIAL
				}, function(response, status){
					if(status == google.maps.DistanceMatrixStatus.OK) {
						var origins = response.originAddresses;
						var destinations = response.destinationAddresses;
						
						for(var i=0; i < origins.length; i++) {
							var results = response.rows[i].elements;
							for(var j=0; j < results.length; j++) {
								output += '<tr><td>' + origins[i] + '</td><td>' + destinations[j] + '</td><td>' + results[j].distance.text + '</td><td>' + results[j].duration.text + '</td></tr>';
							}
						}
						document.getElementById('distance-output').innerHTML = '<table cellpadding="5">' + output + '</table';
					}
					});
		});
//Get Weight Button Clicked		
		$('#cq-get-weight').click(function()
		{
			$.getJSON(base_url+"?callback=?", {cmd:"getModel", model:$('#trim').val()}, function(data) {
			  console.log(data);
              weightnum = parseInt(data[0].model_weight_lbs, 10);
              weight = data[0].model_weight_lbs;
              console.log(weight+" lbs");
              console.log(weightnum / '2000'+" tons");
              $('#car-mode-weight').addClass('alert alert-success');
              $('#car-mode-weight').removeClass('invisible');
              document.getElementById('car-mode-weight').innerHTML = weight;
			  /* console.log(data[0].model_weight_lbs);*/
			  
			});
			
		});
		
	});
