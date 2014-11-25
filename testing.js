$(document).ready(function() {
	(function(d, s, id) {
	     	var js, sdkjs = d.getElementsByTagName(s)[0];
	     	if (d.getElementById(id)) {return;}
	     	js = d.createElement(s); js.id = id;
	     	js.src = "edmunds.api.sdk.js";
	     	sdkjs.parentNode.insertBefore(js, sdkjs);
	   	}(document, 'script', 'edmunds-jssdk'));
	
	//Set Global Variables
	var year = '';
	var make = '';
	var model = '';
	var trim = '';
	var vsize = '';
	var vtype = '';
	   
	// Populate the year select options
	select = document.getElementById('year');		
	for (i=1999; i<2016; i++) {
	select[select.length] = new Option(i, i);
	}


	// Populate the Make select options when the year has been selected   
	$('#year').change(function() {
		// Instantiate the SDK
		var res = new EDMUNDSAPI('b3zjkhuamfv7uy2bqs3sh3cf');
		// Get the year that has been selected
		year = $(this).val();
				
		// Optional parameters
		var options = {"year": year, "view": "basic"};
		var makeSelect = $('#make');
					
		makeSelect.find('option').remove();
		makeSelect.append($("<option/>", {value: '----', text: '----'}));
				
		// Callback function to be called when the API response is returned
		function success(res) {	
			if (res.error) {
				body.innerHTML = "ERROR: " + res.error.message;
			}
					
			$.each(res.makes, function(key, value){
				makeSelect.append($("<option/>", {
					value: value.id,
					text: value.name
				}));
			});
		}
			
		// Oops, Houston we have a problem!
		function fail(data) {
			console.log(data);
		}
			
		// Fire the API call
		res.api('/api/vehicle/v2/makes', options, success, fail);
		// Additional initialization code such as adding Event Listeners goes here*/
	});


	$('#make').change(function(){				
		// Instantiate the SDK
		var res = new EDMUNDSAPI('b3zjkhuamfv7uy2bqs3sh3cf');
		var api = '/api/vehicle/v2/';
		var modelSelect = $('#model');
		
		modelSelect.find('option').remove();
		modelSelect.append($("<option/>", {value: '----', text: '----'}));
		
		// Get the make that has been selected
		/*var yr = $('#year').val();
		var mk = $('#make option:selected').text();
		console.log("Make changed to " + mk);*/
		make = $('#make option:selected').text();
		console.log("Make changed to " + make);				
		// Optional parameters
		var options = {"year": year, "basic": "basic"};
		var api = api + make + '/models';
		console.log(api);		
		// Callback function to be called when the API response is returned
		function success(res) {
			if (res.error) {
				body.innerHTML = "ERROR: " + res.error.message;
			}
					
			$.each(res.models, function(key, value){
				modelSelect.append($("<option/>", {
					value: value.id,
					text: value.name
				}));
			});
		}
				
		// Oops, Houston we have a problem!
		function fail(data) {
			console.log(data);
		}
				
		// Fire the API call
		res.api(api, options, success, fail);
		 // Additional initialization code such as adding Event Listeners goes here
	});
	
	$('#model').change(function(){				
		// Instantiate the SDK
		var res = new EDMUNDSAPI('b3zjkhuamfv7uy2bqs3sh3cf');
		var api = '/api/vehicle/v2/';
		var trimSelect = $('#trim');
		
		trimSelect.find('option').remove();
		trimSelect.append($("<option/>", {value: '----', text: '----'}));
		
		// Get the make that has been selected
		/*var yr = $('#year').val();
		var mk = $('#make option:selected').text();
		console.log("Make changed to " + mk);*/
		model = $('#model option:selected').text();
		console.log("Model changed to " + model);				
		// Optional parameters
		var options = {"year": year, "basic": "basic"};
		var api = api + make + '/' + model + '/' + year + '/styles';
		console.log(api);		
		// Callback function to be called when the API response is returned
		function success(res) {
			if (res.error) {
				body.innerHTML = "ERROR: " + res.error.message;
			}
					
			$.each(res.styles, function(key, value){
				trimSelect.append($("<option/>", {
					value: value.id,
					text: value.name
				}));
			});
		}
				
		// Oops, Houston we have a problem!
		function fail(data) {
			console.log(data);
		}
				
		// Fire the API call
		res.api(api, options, success, fail);
		 // Additional initialization code such as adding Event Listeners goes here
	});

	$('#trim').change(function() {
		trim = $(this).val();
		
		var res = new EDMUNDSAPI('b3zjkhuamfv7uy2bqs3sh3cf');
		var options = {"year": year, "view": "full"};
		
		function success(res){
			if (res.error) {
				body.innerHTML = "ERROR: " + res.error.message;
			}
			
			vType = res.categories.primaryBodyType;
			vSize = res.categories.vehicleSize;
			console.log("The " + year + " " + make + " " + model + " " + $('#trim option:selected').text() + " is a " + vSize + " " + vType);
				
		}
		function fail(data) {
			console.log(data);
		}
		res.api('/api/vehicle/v2/styles/' + trim, options, success, fail);
	});
});
	
