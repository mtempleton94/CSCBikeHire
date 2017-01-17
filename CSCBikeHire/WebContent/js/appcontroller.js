var app = angular.module("app", ['ngCookies']);
app.controller("AppController", function ($scope, $http, $timeout, $cookies, $cookieStore) 
{
	$scope.currentUser = "undefined";
	var mode = 1; //1: General Log in / 2: Sign Up
	var pinEntered = ""; //Store pin entered
	var signUpPinEntered = ""; // Store pin entered during sign up
	$scope.deletePinEntered=''; //Store pin entered when user deletes account
	$scope.selectedBookings = []; //Store all booking times that are currently selected by the user
	$scope.myBookingsArray = new Array(); // Array to store all user bookings 
	var found = false; // Booking record for a particular date exists in array
	
	var hireBikeScrollPos, myBookingsScrollPos; //Store vertical scroll position to prevent user losing position when switching tabs
	
	window.addEventListener("scroll", scroll, false);
	window.addEventListener("resize", scroll, false);

	
	$scope.weekArray = new Array();
	
//=====================================================================================
// Login
//=====================================================================================
    $scope.login = function(user)
	{
    	enableScroll();
		document.getElementById('login').style.display='none';
		$scope.currentUser = user;
		$cookieStore.put('currentUser',$scope.currentUser);
		$cookieStore.put('currentTab','hireabike');
		$scope.generateDates();
		$scope.getBookings();
		document.getElementById("HireABike").style.display = "block";
		document.getElementById("MyBookings").style.display = "block";
		window.location.hash='hireabike';
		scroll();
	}
//=====================================================================================
// END :: Login
//=====================================================================================
	
    
    
    
	 
//=====================================================================================
// Logout
//=====================================================================================	 
	$scope.logout = function()
	{
		enableScroll();
		document.getElementById('optionsOverlay').style.display='none';
		document.getElementById('login').style.display='block';
		$scope.myBookingsArray = [];
		var x = document.getElementsByClassName("tabBody");
		document.getElementById("HireABike").style.display = "none";
		document.getElementById("MyBookings").style.display = "none";
		history.pushState('', document.title, window.location.pathname); //Revove hashed index
		$scope.deletePinEntered = '';
		$cookieStore.remove('currentUser');
		$cookieStore.remove('currentTab');
		$scope.clearLogin();
	}
//=====================================================================================
// END :: Logout
//=====================================================================================	
	
	

	
//=====================================================================================
// Numpad Key Pressed (Login)
//=====================================================================================	
	$scope.loginKey = function(key)
	{
		var enteredEmail = document.getElementById('emailEntry');
		var loginActionDisplay = document.getElementById('loginActionDisplay');
		
		if(key === 'del') // Delete Key Pressed
		{
			if(pinEntered.length > 0 && pinEntered.length < 4) // Entering first pin
			{
				pinEntered = pinEntered.slice(0, -1);
				$scope.setPinDisplay(pinEntered.length);
			}
		}
		else // Number Key Pressed
		{
			pinEntered+=key;
			$scope.setPinDisplay(pinEntered.length);
		}
        	
        	if(pinEntered.length == 4 && enteredEmail.value != "") //Pin and Email Address have been entered 
            {
        		if ($scope.validateEntry(enteredEmail))
        			$scope.completeLogin(enteredEmail);
            }	
            else if (pinEntered.length == 4 && enteredEmail.value == "") //No Email Address Entered
            {
	    		pinEntered="";
	    		loginActionDisplay.innerHTML = "Please Enter a CSC E-Mail Address"; 
    		}   
        }
//=====================================================================================
// END :: Numpad Key Pressed (Login)
//=====================================================================================	
	

	
	
//=====================================================================================
// Numpad Key Pressed (Delete Account)
//=====================================================================================
	$scope.deleteKey = function(key)
	{
		var deleteActionDisplay = document.getElementById('deleteActionDisplay');
		
		//Delete Key
		if(key === 'del')
		{
			if($scope.deletePinEntered.length > 0)
			{
				$scope.deletePinEntered = $scope.deletePinEntered.slice(0, -1);
			}
		} 
		else
		{
			$scope.deletePinEntered+=key;
		}
		
		switch($scope.deletePinEntered.length) 
    	{
		case 0:
			deleteActionDisplay.innerHTML = "Enter your Pin";
			break;
    	case 1:
    		deleteActionDisplay.innerHTML = "."; 
        	break;
        case 2:
        	deleteActionDisplay.innerHTML = "..";             
        	break;
        case 3:
        	deleteActionDisplay.innerHTML = "...";             
        	break;
        case 4:
        	deleteActionDisplay.innerHTML = "...."; 
        	$scope.verifyAccount($scope.deletePinEntered);
        	break;
    	} 
    }
//=====================================================================================
// END :: Numpad Key Pressed (Delete Account)
//=====================================================================================	
	
	
	
	
	
//=====================================================================================
// Verify Account Details During Deletion
//=====================================================================================	
	$scope.verifyAccount = function(deletePinEntered) // Used to verify account for deletion
	{
    	var data = $.param({employeeID: $scope.currentUser, pin: deletePinEntered});
		var deleteActionDisplay = document.getElementById('deleteActionDisplay');
    	$http.get('http://localhost:8080/CSCBikeHire/rest/hire/userlogin/'+$scope.currentUser+'/'+deletePinEntered, data)   
    	.success(function(userLoginResponse)
    	{	
    		$scope.userLoginResult = userLoginResponse;
    		
    		if(userLoginResponse.length < 1) //Incorrect Pin Entered
    		{
    			deleteActionDisplay.innerHTML = "Incorrect E-Mail Address or Pin";
    			$scope.deletePinEntered='';
    		}
    		else
    		{
    			deleteActionDisplay.innerHTML = "Please Enter your Pin";
    			$scope.deleteUser($scope.currentUser, deletePinEntered);
    		}
    		pinEntered="";
    	});
	}
//=====================================================================================
// END :: Verify Account Details During Deletion
//=====================================================================================		
	
	
	
	
	
//=====================================================================================
// Trigger Database Deletion (User)
//=====================================================================================		
	$scope.deleteUser = function(user, pin) 
	{
		var deleteData = $.param({
            employeeID: user, 
			pin: pin });
		$http.delete('http://localhost:8080/CSCBikeHire/rest/hire/deleteuser/'+user+'/'+pin, deleteData, config)      
	        .success(function (deleteData, status, headers, config) {
	            $scope.PostDataResponse = deleteData; 
	    		$cookieStore.remove('currentUser');
	    		$cookieStore.remove('currentTab');
	            $scope.logout();
	            alert("Your Account has been Deleted");
	        })
	        .error(function (deleteData, status, header, config) {
	            $scope.ResponseDetails = "Data: " + deleteData +
	                "<hr />status: " + status +
	                "<hr />headers: " + header +
	                "<hr />config: " + config;
	        });
	}
//=====================================================================================
// END :: Trigger Database Deletion (User)
//=====================================================================================	
	
	
	
	
	
//=====================================================================================
// Display Pin Entry to User (Login Screen)
//=====================================================================================	
	$scope.setPinDisplay = function(pinLength)
	{
    	switch(pinLength) 
    	{
		case 0:
			if(pinEntered.length === 4)
				loginActionDisplay.innerHTML = "Please Re-Enter Your New Pin"; 
			else
			{
				if(mode === 1)
				{
					loginActionDisplay.innerHTML = "Please Enter your Pin";
				}
				else if (mode === 2)
				{
					loginActionDisplay.innerHTML = "Please Enter a Pin";
				}
			}
			break;
    	case 1:
    		loginActionDisplay.innerHTML = "."; 
        	break;
        case 2:
        	loginActionDisplay.innerHTML = "..";             
        	break;
        case 3:
        	loginActionDisplay.innerHTML = "...";             
        	break;
        case 4:
        	loginActionDisplay.innerHTML = "....";             
        	break;
    	} 
	}
//=====================================================================================
// END :: Display Pin Entry to User (Login Screen)
//=====================================================================================
	
	
	
	
	
//=====================================================================================
// User Completes Entry of 4-Digit pin (Log In / Sign Up)
//=====================================================================================	
	$scope.completeLogin = function(enteredEmail) //User has entered an email address and pin
	{
		document.getElementById("noBookingsMessage").style.display = 'none';
		var enteredEmailValue = enteredEmail.value;
		if(enteredEmailValue.indexOf("@") > 0)
		{
			enteredEmailValue = enteredEmailValue.split("@")[0];
		}
		
		if(mode == 1) // Log In
		{
        	var data = $.param({employeeID: enteredEmailValue, pin: pinEntered});
        	$http.get('http://localhost:8080/CSCBikeHire/rest/hire/userlogin/'+enteredEmailValue+'/'+pinEntered, data)  
        	.success(function(userLoginResponse)
        	{	
        		$scope.userLoginResult = userLoginResponse;
        		
        		if(userLoginResponse.length < 1) //Incorrect Pin Entered
        		{
        			loginActionDisplay.innerHTML = "Incorrect E-Mail Address or Pin"; 
        		}
        			
        		$scope.userLoginResult.forEach(function(emailAddress) 
        		{
        			if(emailAddress.verified == 1)
        			{
            			$scope.login(enteredEmailValue);
        			}
        			else
        			{
        				loginActionDisplay.innerHTML = "Account Not Verified.";
        				alert("Your Account has not been Verified. Please check your Email for a Verification Link or Sign Up again.");
        			}
        		});
        		pinEntered="";
        	});
		} 
    	else if (mode == 2) //Sign Up
    	{
    		if(signUpPinEntered == pinEntered)
    		{
    		 	$scope.checkUserExists(enteredEmailValue, "signUp");	
    		} 
    		else if (signUpPinEntered == "")
    		{
        		loginActionDisplay.innerHTML = "Please Re-Enter your Pin";
        		signUpPinEntered = pinEntered;
        		pinEntered="";
    		}
    		else
    		{
        		loginActionDisplay.innerHTML = "Pins do not Match. Try Again";
        		pinEntered = "";
        		signUpPinEntered = "";
    		}
    	}
	}
//=====================================================================================
// END :: User Completes Entry of 4-Digit pin (Log In / Sign Up)
//=====================================================================================	
	
	
	
	
	
//=====================================================================================
// Ensure Email Address is Valid
//=====================================================================================	
	$scope.validateEntry = function(emailAddress)
	{
		var validateSearch = emailAddress.value.search(/[^a-z0-9]/gi);
		if(validateSearch >= 0)
		{
			if(emailAddress.value.indexOf("@") > 0)
				{
					var host = (emailAddress.value.split("@")[1]); //get name of host from value after '@' (should be CSC or blank)
					if(host.toUpperCase() === "CSC.COM" || host.toUpperCase() === "CSC")
					{
						return true; //csc email used
					}
				}
			alert("Invalid Entry. please use your CSC E-Mail Address");
			$scope.clearLogin();
			return false;
		}
		else
		{
			return true;
		}
	}
//=====================================================================================
// END :: Ensure Email Address is Valid 
//=====================================================================================
	
	
	
	
	
//=====================================================================================
// Add New User to DB
//=====================================================================================		
	$scope.createNewUser = function(emailAddress, pin)
	{
		var randomNumber = Math.floor(Math.random() * (5000 - 1000) + 1000);
		var randomString = randomNumber.toString();
		var hash = MD5(randomString)
			
			var data = $.param({
	            employeeID: emailAddress,
	            pin: pin,
	            hash: hash
	        });
	        
	      $http.post('http://localhost:8080/CSCBikeHire/rest/hire/createuser', data, config)  
	        .success(function (data, status, headers, config) {
	            $scope.PostDataResponse = data;
	            alert("A Verification E-Mail has been sent to "+emailAddress+"@csc.com");
	            console.log("http://localhost:8080/CSCBikeHire/verifyaccount.html?employeeID="+emailAddress+"&hash="+hash)
	        })
	        .error(function (data, status, header, config) {
	            $scope.ResponseDetails = "Data: " + data +
	                "<hr />status: " + status +
	                "<hr />headers: " + header +
	                "<hr />config: " + config;
	        });
	}
//=====================================================================================
// END :: Add New User to DB
//=====================================================================================

	
	
	
	
//=====================================================================================
// Reset Login Screen to Initial State
//=====================================================================================
	$scope.clearLogin = function()
	{
		mode = 1;
	    pinEntered = "";
		signUpPinEntered = "";
		loginActionDisplay.innerHTML = "Please Enter a CSC E-Mail Address"; 
		document.getElementById('emailEntry').value = "";
		document.getElementById("signUpButton").firstChild.data = "Sign Up";
	}
//=====================================================================================
// END :: Reset Login Screen to Initial State
//=====================================================================================

	
	
	

//=====================================================================================
// Sign Up Button Pressed (Switch Login Screen to Sign Up State)
//=====================================================================================	
	$scope.signUp = function()
	{
		var text = document.getElementById("signUpButton").firstChild;
		text.data = text.data == "Sign Up" ? "Cancel Sign Up" : "Sign Up";
		
		if(mode==1)
		{
			mode = 2;
			pinEntered="";
			var enteredEmail = document.getElementById('emailEntry');
			var loginActionDisplay = document.getElementById('loginActionDisplay');
	       
			if (enteredEmail.value == "") //No Email Address Entered
			{
	        	loginActionDisplay.innerHTML = "Please Enter a CSC E-Mail Address"; 
			}
			else //Email Has been entered
			{
				loginActionDisplay.innerHTML = "Please Enter a Pin"; 
			}
		} 
		else 
		{
			$scope.clearLogin();
		}
	}
//=====================================================================================
// END :: Sign Up Button Pressed (Switch Login Screen to Sign Up State)
//=====================================================================================	
	
	

	
	
	
//=====================================================================================
// Update hash for User - Used when user has forgotten their pin
//=====================================================================================
	$scope.updateHash = function(emailAddress, callingFunction)
	{
		var randomNumber = Math.floor(Math.random() * (5000 - 1000) + 1000);
		var randomString = randomNumber.toString();
		var hash = MD5(randomString)
			
			var data = $.param({
	            employeeID: emailAddress,
	            hash: hash
	        });
	        
	      $http.post('http://localhost:8080/CSCBikeHire/rest/hire/updatehash', data, config)  
	        .success(function (data, status, headers, config) {
	            $scope.PostDataResponse = data;
	            if(callingFunction == "signUp")
	            {
		            console.log("http://localhost:8080/CSCBikeHire/verifyaccount.html?employeeID="+emailAddress+"&hash="+hash)
	            }
	            else if (callingFunction == "forgotPin")
	            {
		            console.log("http://localhost:8080/CSCBikeHire/resetpin.html?employeeID="+emailAddress+"&hash="+hash)
	            }
	        })
	        .error(function (data, status, header, config) {
	            $scope.ResponseDetails = "Data: " + data +
	                "<hr />status: " + status +
	                "<hr />headers: " + header +
	                "<hr />config: " + config;
	        });
	}
//=====================================================================================
// END :: Update hash for User - Used when user has forgotten their pin
//=====================================================================================

	
	
	
	
//=====================================================================================
// Get All User Bookings 
//=====================================================================================	
	$scope.getBookings = function() 
{
	$http.get('http://localhost:8080/CSCBikeHire/rest/hire/data')  
	.success(function(response)
	{	
		$scope.result = response;
		$scope.result.forEach(function(date) {
		    $scope.updadeBookingDisplay(date);
		});
		$scope.getUserBookings();
	});
}
//=====================================================================================
// END :: Get All User Bookings 
//=====================================================================================		
	

	
//=====================================================================================
// Check if a user exists in the DB 
//=====================================================================================	 
	$scope.checkUserExists = function (employeeID, callingFunction) 
    {
		var userFound = false;
		var data = $.param({employeeID: employeeID});
		$http.get('http://localhost:8080/CSCBikeHire/rest/hire/finduser/'+employeeID, data)  
		.success(function(userBookingResponse)
		{	
			var accountVerified = 0;
			$scope.userBookingResult = userBookingResponse;	
			$scope.userBookingResult.forEach(function(result) 
			{
				accountVerified = result.verified;
			});
			
			if(callingFunction == "signUp")
			{
				if($scope.userBookingResult.length > 0)
				{
					//check if the account has been verified
					if(accountVerified == 1)
					{
						alert("An account already exists for this user")
						$scope.clearLogin();
					}
					else
					{
						//Generate a new hash and send a new verification email
						$scope.updateHash(employeeID, callingFunction);
						$scope.setPin(employeeID, pinEntered);
			            alert("A Verification E-Mail has been sent to "+employeeID+"@csc.com");
					}
				}
				else
				{
					$scope.createNewUser(employeeID, pinEntered); 
					$scope.clearLogin();
				}
			}
			
			else if(callingFunction == "forgotPin")
			{
				if($scope.userBookingResult.length == 0)
				{
					alert("This User Does Not Exist")
					document.getElementById('forgotPinEmailEntry').value = '';
				}
				else
				{
					var enteredEmail = document.getElementById('forgotPinEmailEntry').value;
					document.getElementById('forgotPinOverlay').style.display = 'none';
					alert("Pin Reset Email Sent to "+enteredEmail+"@csc.com");
					$scope.updateHash(enteredEmail, callingFunction);
					document.getElementById('forgotPinEmailEntry').value = '';
				}
			}
		});
    };
//=====================================================================================
// END :: Check if a user exists in the DB  
//=====================================================================================	 	

    
    
    

//=====================================================================================
// Change Stored Pin For a User
//=====================================================================================	 	
$scope.setPin = function(employeeID, pinEntered)
{
	var data = $.param({
			employeeID: employeeID,
			pin: pinEntered
		});
				        
		$http.post('http://localhost:8080/CSCBikeHire/rest/hire/updatepin', data, config)  
				.success(function (data, status, headers, config) {
				      $scope.PostDataResponse = data;
				        })
				.error(function (data, status, header, config) {
				       $scope.ResponseDetails = "Data: " + data +
				        "<hr />status: " + status +
				        "<hr />headers: " + header +
				        "<hr />config: " + config;
				        });
	
}
//=====================================================================================
// END :: Change Stored Pin For a User
//=====================================================================================
	



//=====================================================================================
// Get Current User Bookings 
//=====================================================================================	 
$scope.getUserBookings = function () 
{
	var data = $.param({employeeID: $scope.currentUser});
	$http.get('http://localhost:8080/CSCBikeHire/rest/hire/userbookings/'+$scope.currentUser, data)  
	.success(function(userBookingResponse)
	{	
		$scope.userBookingResult = userBookingResponse;
		$scope.userBookingResult.forEach(function(date) 
		{
			    $scope.updateBookingDisplayUser(date);
			    scroll();
		});
	});
};
//=====================================================================================
// END :: Get Current User Bookings 
//=====================================================================================	 	
	
  
	


//=====================================================================================
// Order Items By Date (Used For My Bookings Tab)
//=====================================================================================	
$scope.orderByDate = function(item) 
{
    var parts = item.date.split('/');
    var number = parseInt(parts[2] + parts[1] + parts[0]);
    return number;
};
//=====================================================================================
// END :: Order Items By Date (Used For My Bookings Tab)
//=====================================================================================		
	




//=====================================================================================
// Add a New Booking  
//=====================================================================================
	var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}}
	$scope.agreeStatDec = function () 
    {
		document.getElementById("makeBookingButton").style.display = 'none';
		scroll();
		enableScroll();
		document.getElementById('overlay').style.display = 'none';
		document.getElementById('confirmBookingWindow').style.display = 'block';
		document.getElementById('statDecWindow').style.display = 'none';
    	
		var arrayLength = $scope.selectedBookings.length;
    	for (var i = 0; i < arrayLength; i++) 
    	{
    		var dateTimeslot = $scope.selectedBookings[i].split("-"); 
    		var sqlDate = convertDateSQL(dateTimeslot[0]);
    		
    		var data = $.param({
    	            employeeID: $scope.currentUser,
    				date: sqlDate,
    	            timeslot: dateTimeslot[1]
    	        });
    	        
    	      $http.post('http://localhost:8080/CSCBikeHire/rest/hire', data, config)  
    	        .success(function (data, status, headers, config) {
    	            $scope.PostDataResponse = data;
    	        })
    	        .error(function (data, status, header, config) {
    	            $scope.ResponseDetails = "Data: " + data +
    	                "<hr />status: " + status +
    	                "<hr />headers: " + header +
    	                "<hr />config: " + config;
    	        });
    	}
    	$scope.updateDisplay();
    };
//=====================================================================================
// END :: Add a New Booking  
//=====================================================================================	 
	
    
    
    
    
//=====================================================================================   
// Format Dates for Display in the Selection Confirmation Window  
//=====================================================================================   
	$scope.formatSelectedBooking = function(booking)
	{
		var dateTimeslot = booking.split("-"); 
		var formattedDate = $scope.formatDate(dateTimeslot[0])
		var timeslot = "8 - 11";
		if(dateTimeslot[1] == 2)
			timeslot = "11 - 2";
		if(dateTimeslot[1] == 3)
			timeslot = "2 - 5";
		return formattedDate.dayWord+" "+formattedDate.dayNum+" "+formattedDate.monthWord+" at "+timeslot;
	}
//=====================================================================================   
// END :: Format Dates for Display in the Selection Confirmation Window  
//===================================================================================== 	
	
	
	
	
	
//=====================================================================================
// Update Booking Display After Timeout (Ensure Processing Has Completed) 
//=====================================================================================
	$scope.updateDisplay = function()
	{
		//Update the display
		setTimeout(function () {
		    $scope.$apply(function () {
		         $http.get('http://localhost:8080/CSCBikeHire/rest/hire/data')  
	        	.success(function(response)
	        	{	
	        		$scope.result = response;
	        		$scope.result.forEach(function(date) {
	        		    $scope.updadeBookingDisplay(date);
	        		});
	        		
	        		if(initialMyBookings === true)
	        		{
	        			initialMyBookings = false;
		        		$scope.displayMyBookingsContent();
	        		}
	        		$scope.getUserBookings(); //Get the current user's bookings
	        		$scope.selectedBookings = []; //Clear the array of selected items
		    	});
		    });
		}, 1000);
	}
//=====================================================================================
// END :: Update Booking Display After Timeout (Ensure Processing Has Completed) 
//=====================================================================================

	
	
	
	
	
	
	
//=====================================================================================
// Call time check to se lock access (60 Second Intervals)
//=====================================================================================	
	// People can unlock a bike if they have it in the next 10 minutes and can continue 
	// accessing it 1 hour after the session ends (hopefully to prevent people leaving the
	// bike locked up away from CSC)
	
	setInterval(function () {
	    $scope.$apply(function () 
	    {
	    	$scope.lockTimeCheck();
	    });
	}, 60000);
//=====================================================================================
// END :: Call time check to se lock access (60 Second Intervals)
//=====================================================================================
	
	
	
	
	
//=====================================================================================
// Time Check to update lock access for bikes 
//=====================================================================================		
	$scope.lockTimeCheck = function() 
	{
		var timeCheck = new Date();
		for(var i = 0; i < $scope.myBookingsArray.length; i++)
		{
			if($scope.myBookingsArray[i].date === timeCheck.getDate()+"/"+timeCheck.getMonth()+1+"/"+timeCheck.getFullYear()) // User has a booking for today 
			{
				var bikeNumbers = $scope.myBookingsArray[i].bikeNumbers.split("/"); 
				var timeslots = $scope.myBookingsArray[i].timeslots.split("-"); 
				
				// Make Bike Locks Available 
				for (var j in timeslots) 
				{
    				/* Timeslot 1 - 7:50 - 12 */
					if(timeslots[j] == 1)
					{
	    				if(timeCheck.getHours() >= 7 && timeCheck.getHours() <= 11)
	    				{
	    					if((timeCheck.getHours() === 7 && timeCheck.getMinutes() >= 50) || timeCheck.getHours() >= 8)
	    					{
	    						$scope.updateLockState($scope.myBookingsArray[i].date, 1, bikeNumbers[j], 1); /*date, timeslot, bike no, state  */
	    					}
	    					else if(timeCheck.getHours() === 7 && timeCheck.getMinutes() < 50)
	    					{
	    						$scope.updateLockState($scope.myBookingsArray[i].date, 1, bikeNumbers[j], 0);
	    					}
	    				}
	    				else if(timeCheck.getHours() < 7 ||  timeCheck.getHours() > 11)/* earlier than 7 or later than 12 */
	    				{
	    					$scope.updateLockState($scope.myBookingsArray[i].date, 1, bikeNumbers[j], 0);
	    				}
					} 
					
					/* Timeslot 2 - 10:50 - 3 */ //Assume 24hr time? = 10:50 - 15
					else if (timeslots[j] == 2)
					{
	    				if(timeCheck.getHours() >= 10 && timeCheck.getHours() <= 14)
	    				{
	    					if((timeCheck.getHours() === 10 && timeCheck.getMinutes() >= 50) || timeCheck.getHours() >= 11)
	    					{
	    						$scope.updateLockState($scope.myBookingsArray[i].date, 2, bikeNumbers[j], 1); /*date, timeslot, bike no, state  */
	    					}
	    					else if(timeCheck.getHours() === 10 && timeCheck.getMinutes() < 50)
	    					{
	    						$scope.updateLockState($scope.myBookingsArray[i].date, 2, bikeNumbers[j], 0);
	    					}
	    				}
	    				else if(timeCheck.getHours() < 10 ||  timeCheck.getHours() > 14)/* earlier than 10 or later than 3 */
	    				{
	    					$scope.updateLockState($scope.myBookingsArray[i].date, 2, bikeNumbers[j], 0);
	    				}
					}
					
					/* Timeslot 3 - 1:50 - 6*/ //Assume 24hr time? = 13:50 - 18
					else if (timeslots[j] == 3)
					{
	    				if(timeCheck.getHours() >= 13 && timeCheck.getHours() <= 17)
	    				{
	    					if((timeCheck.getHours() === 13 && timeCheck.getMinutes() >= 50) || timeCheck.getHours() >= 14)
	    					{
	    						$scope.updateLockState($scope.myBookingsArray[i].date, 3, bikeNumbers[j], 1); /*date, timeslot, bike no, state  */
	    					}
	    					else if(timeCheck.getHours() === 13 && timeCheck.getMinutes() < 50)
	    					{
	    						$scope.updateLockState($scope.myBookingsArray[i].date, 3, bikeNumbers[j], 0);
	    					}
	    				}
	    				else if(timeCheck.getHours() < 13 ||  timeCheck.getHours() > 17)/* earlier than 1 or later than 6 */
	    				{
	    					$scope.updateLockState($scope.myBookingsArray[i].date, 3, bikeNumbers[j], 0);
	    				}
					}
				}
				break;
			}
		}
	}
//=====================================================================================
// END :: Time Check to update lock access for bikes 
//=====================================================================================		
	

	
	
	
//=====================================================================================
// Set State of a Lock 
//=====================================================================================		
	//State
		// 0 = Unavailable
		// 1 = Available
		// 2 = Unlocked
	$scope.updateLockState = function(date, timeslot, bikeNo, state)
	{
		if(state == 0 && document.getElementById("mb_lkbody-"+date+"-"+timeslot).style.background != "red")
		{
			document.getElementById("mb_lkloop-"+date+"-"+timeslot).style.background = "red";
			document.getElementById("mb_lkbody-"+date+"-"+timeslot).style.background = "red";
		}
		
		if(state == 1 && document.getElementById("mb_lkbody-"+date+"-"+timeslot).style.background != "rgb(255, 204, 0)" && document.getElementById("mb_lkbody-"+date+"-"+timeslot).style.background != "green")
		{
			document.getElementById("mb_lkloop-"+date+"-"+timeslot).style.background = "#ffcc00";
			document.getElementById("mb_lkbody-"+date+"-"+timeslot).style.background = "#ffcc00";
		}
		if(state == 2 && document.getElementById("mb_lkbody-"+date+"-"+timeslot).style.background != "green" && document.getElementById("mb_lkbody-"+date+"-"+timeslot).style.background === "rgb(255, 204, 0)")
		{
			for(var i = 0; i < $scope.myBookingsArray.length; i++) 
			{
			    if ($scope.myBookingsArray[i].date == date) 
			    {
					var bikeNumbers = $scope.myBookingsArray[i].bikeNumbers.split("/");
					var timeslots = $scope.myBookingsArray[i].timeslots.split("-");
			    }
			}
			var bikeNum = 0;
			// Make Bike Locks Available 
			for (var i in timeslots) 
			{
				if(timeslots[i] == timeslot)
					bikeNum = bikeNumbers[i]; 
			}
			console.log("Unlock Bike ");
			document.getElementById("mb_lkloop-"+date+"-"+timeslot).style.background = "green";
			document.getElementById("mb_lkbody-"+date+"-"+timeslot).style.background = "green";
		}
	}
//=====================================================================================
// END :: Set State of a Lock 
//=====================================================================================	
	
	
	
	
	
//=====================================================================================
// Convert Dates to appropriate format
//=====================================================================================	
	// Date Format: yyyy-mm-dd
	function convertDateSQL(date)
	{
		var dateComponents = date.split("/"); 
		var sqlFormatDate = dateComponents[2]+"-"+dateComponents[1]+"-"+dateComponents[0];
		return sqlFormatDate;
	}
	
	// Date Format: dd/mm/yyyy
	function convertDateJS(date)
	{
		var dateComponents = date.split("-"); 
		var sqlFormatDate = dateComponents[2]+"/"+dateComponents[1]+"/"+dateComponents[0];
		return sqlFormatDate;
	}
	
	// Date Format: day, dd, month
	$scope.formatDate = function(date)
	{
		var newDate = new Date(convertDateSQL(date));
		var dayNum = newDate.getDate();
		if (dayNum < 10)
		{
			dayNum = "0"+dayNum;
		}
		return ({"dayWord":weekday[newDate.getDay()], "dayNum":dayNum, "monthWord":month[newDate.getMonth()]});
	}
//=====================================================================================
// END :: Convert Dates to appropriate format
//=====================================================================================	
	
	

	
	
//=====================================================================================
// Set Timeslot Squares to the appropriate Colour
//=====================================================================================
	$scope.updadeBookingDisplay = function(date) 
	{
		//Timeslot 1
		var bookingID = date.date+"-1";
		if(date.timeslot1 < 5)
			$scope.changeTimeslotColour(document.getElementById(bookingID),1);
		else
			$scope.changeTimeslotColour(document.getElementById(bookingID),2);

		//Timeslot 2
		bookingID = date.date+"-2";
		if(date.timeslot2 < 5)
			$scope.changeTimeslotColour(document.getElementById(bookingID),1);
		else
			$scope.changeTimeslotColour(document.getElementById(bookingID),2);
		
		//Timeslot 3
		bookingID = date.date+"-3";
		if(date.timeslot3 < 5)
			$scope.changeTimeslotColour(document.getElementById(bookingID),1);
		else
			$scope.changeTimeslotColour(document.getElementById(bookingID),2);
	}
//=====================================================================================
// END :: Set Timeslot Squares to the appropriate Colour
//=====================================================================================

	
	
	
	
//=====================================================================================
// Create array of user bookings 
//=====================================================================================	
	$scope.updateBookingDisplayUser = function(date) 
	{
		var formattedDate = convertDateJS(date.date);		
		var bookingID = formattedDate+"-"+date.timeslot;
		$scope.changeTimeslotColour(document.getElementById(bookingID),3);
		
		//Remove message displaying no bookings
		document.getElementById("noBookingsMessage").style.display = 'none';
		
		for(var i = 0; i < $scope.myBookingsArray.length; i++) 
		{
		    if ($scope.myBookingsArray[i].date == formattedDate) 
		    {
		        found = true;
		        if($scope.myBookingsArray[i].timeslots.indexOf(date.timeslot) == -1) 
		        {
		        	$scope.myBookingsArray[i].timeslots += "-"+date.timeslot;
		        	$scope.myBookingsArray[i].bikeNumbers += "/"+date.bikeNumber;
		        }
		        break;
		    }
		}
		if(found == false)
			{
				$scope.myBookingsArray.push({"date":formattedDate, "timeslots":date.timeslot, "bikeNumbers":date.bikeNumber});
			}
		found = false;
	}
//=====================================================================================
// END :: Create array of user bookings 
//=====================================================================================	
	
	
	
	
//=====================================================================================
// Disply content in My Bookings 
//=====================================================================================		
	$scope.displayMyBookingsContent = function() 
	{
	  if($scope.myBookingsArray.length === 0)
		  {
		  $scope.updateDisplay();
		  }
		for (var i in $scope.myBookingsArray) 
		{
			var timeslots = $scope.myBookingsArray[i].timeslots.split("-"); 
			var bikeNumbers = $scope.myBookingsArray[i].bikeNumbers.split("/"); 
    		
			for (var j in timeslots) 
			{
				document.getElementById("mb-"+$scope.myBookingsArray[i].date+"-"+timeslots[j]).style.display = 'inline-block';
				document.getElementById("mb_bn-"+$scope.myBookingsArray[i].date+"-"+timeslots[j]).innerHTML = "Bike No. "+bikeNumbers[j];
				$scope.lockTimeCheck();
			}
		}
	}
//=====================================================================================
// END :: Disply content in My Bookings 
//=====================================================================================		
	

	
	
	
//=====================================================================================
// Change Colour of a Timeslot Square
//=====================================================================================		
	//Colours
		// 1 = White
		// 2 = Red
		// 3 = Green
		// 4 = Black
	$scope.changeTimeslotColour = function(element, color) 
	{
    	switch(color) 
    	{
        case 1:
        	var backgroundColor = "rgba(255, 255, 255, 0.4)";
			break;
        case 2:
        	var backgroundColor = "rgba(255, 0, 0, 0.4)";
            break;
        case 3:
        	var backgroundColor = "rgba(0, 255, 0, 0.4)";
            break;
        case 4:
        	var backgroundColor = "rgba(0, 0, 0, 0.4)";
            break;
    	} 
    	element.style.background = backgroundColor;
	}
//=====================================================================================
// END :: Change Colour of a Timeslot Square
//=====================================================================================	
	
	
	
	
	
//=====================================================================================
// Cancel Booking
//=====================================================================================		
	var cancelDate;
	var cancelTime;
	
	$scope.cancelBooking = function(date, timeslot) 
	{
		disableScroll();
		document.getElementById('cancelOverlay').style.display = 'block';
		var element = document.getElementById("cancelDateTime");
		element.innerHTML = $scope.formatSelectedBooking(date + "-" + timeslot);
		cancelDate = date;
		cancelTime = timeslot;
	}
	
	$scope.confirmCancel = function() 
	{
		enableScroll();
		document.getElementById('cancelOverlay').style.display = 'none';
		
		//Check if cancelled booking was for today (Needs to be stored as bike lock may have been accessed)
		var dateComponents = cancelDate.split('/');
		var currentDate = new Date();
		if(dateComponents[1] == currentDate.getMonth()+1 && dateComponents[0] == currentDate.getDate())
		{
			$scope.addBookingCancellation($scope.currentUser, convertDateSQL(cancelDate), cancelTime);
		} 
		else
		{
			deleteBooking();
		}
	}
//=====================================================================================
// END :: Cancel Booking 
//=====================================================================================	
	
	
	
	

//=====================================================================================
// Record Booking Cancellation
//=====================================================================================	
$scope.addBookingCancellation = function(user, date, time) 
{
	var data = $.param({
        employeeID: user,
		date: date,
        timeslot: time
    });
    
  $http.post('http://localhost:8080/CSCBikeHire/rest/hire/cancellation', data, config)  
    .success(function (data, status, headers, config) {
        $scope.PostDataResponse = data;
        deleteBooking();
    })
    .error(function (data, status, header, config) {
        $scope.ResponseDetails = "Data: " + data +
            "<hr />status: " + status +
            "<hr />headers: " + header +
            "<hr />config: " + config;
    });
}
//=====================================================================================
// END :: Record Booking Cancellation
//=====================================================================================		
	




//=====================================================================================
// Perform Booking Deletion
//=====================================================================================
function deleteBooking()
{
	//Delete from booking table
	var deleteData = $.param({
        employeeID: $scope.currentUser,
		date: cancelDate,
        timeslot: cancelTime
    });
	
	$http.delete('http://localhost:8080/CSCBikeHire/rest/hire/delete/'+$scope.currentUser+'/'+convertDateSQL(cancelDate)+'/'+cancelTime, deleteData, config)      
	.success(function (deleteData, status, headers, config) {
	    $scope.PostDataResponse = deleteData;
	    
	    for(var i = 0; i < $scope.myBookingsArray.length; i++) 
	    {
		var obj = $scope.myBookingsArray[i];
	
			if(obj.date == cancelDate && obj.timeslots.indexOf("-") == -1) // Final booking for the day
			{
				var bookingID = $scope.myBookingsArray[i].date+"-"+$scope.myBookingsArray[i].timeslots;
				$scope.changeTimeslotColour(document.getElementById(bookingID),1); 
				$scope.myBookingsArray.splice(i, 1);
				
				//Display message if user has no bookings
				if($scope.myBookingsArray.length === 0)
				{
					document.getElementById("noBookingsMessage").style.display = 'block';
				}
		
			}
			else if (obj.date == cancelDate) // Not final booking for the day
			{
				var bookingElement = document.getElementById("mb-"+obj.date+"-"+cancelTime);
				bookingElement.style.display = 'none';
					        			
				var n = $scope.myBookingsArray[i].timeslots.indexOf(cancelTime);
				$scope.myBookingsArray[i].timeslots = $scope.myBookingsArray[i].timeslots.slice(0, n) + $scope.myBookingsArray[i].timeslots.slice(n+1);
				$scope.myBookingsArray[i].bikeNumbers = $scope.myBookingsArray[i].bikeNumbers.slice(0, n) + $scope.myBookingsArray[i].bikeNumbers.slice(n+1);
	
				//First Timeslot Identifier
				if(n == 0)
					{
	    				$scope.myBookingsArray[i].timeslots = $scope.myBookingsArray[i].timeslots.slice(0, 0) + $scope.myBookingsArray[i].timeslots.slice(1);
	    				$scope.myBookingsArray[i].bikeNumbers = $scope.myBookingsArray[i].bikeNumbers.slice(0, 0) + $scope.myBookingsArray[i].bikeNumbers.slice(1);
					}
				//Second Timeslot Identifier
				else if (n == $scope.myBookingsArray[i].timeslots.length)
					{
	    				$scope.myBookingsArray[i].timeslots = $scope.myBookingsArray[i].timeslots.slice(0, n-1);
	    				$scope.myBookingsArray[i].bikeNumbers = $scope.myBookingsArray[i].bikeNumbers.slice(0, n-1);
					}
				//Third Timeslot Identifier
				else
					{
						$scope.myBookingsArray[i].timeslots = $scope.myBookingsArray[i].timeslots.slice(0, 1) + $scope.myBookingsArray[i].timeslots.slice(2);
						$scope.myBookingsArray[i].bikeNumbers = $scope.myBookingsArray[i].bikeNumbers.slice(0, 1) + $scope.myBookingsArray[i].bikeNumbers.slice(2);
					}
			}
		}
	    $scope.updateDisplay();
	})
	.error(function (deleteData, status, header, config) {
	    $scope.ResponseDetails = "Data: " + deleteData +
	        "<hr />status: " + status +
	        "<hr />headers: " + header +
	        "<hr />config: " + config;
	});
}
//=====================================================================================
// END :: Perform Booking Deletion
//=====================================================================================


	
	
	
	
		
//=====================================================================================
// Generate Array of Dates
//=====================================================================================
     var weekday = new Array(7);
	 weekday[0]=  "Sun";
	 weekday[1] = "Mon";
	 weekday[2] = "Tue";
	 weekday[3] = "Wed";
	 weekday[4] = "Thu";
	 weekday[5] = "Fri";
	 weekday[6] = "Sat";
	 
	 var month = new Array();
	 month[0] = "Jan";
	 month[1] = "Feb";
	 month[2] = "Mar";
	 month[3] = "Apr";
	 month[4] = "May";
	 month[5] = "Jun";
	 month[6] = "Jul";
	 month[7] = "Aug";
	 month[8] = "Sep";
	 month[9] = "Oct";
	 month[10] = "Nov";
	 month[11] = "Dec";
 
	
	Date.prototype.addDays = function(days) {
        var dat = new Date(this.valueOf())
        dat.setDate(dat.getDate() + days);
        return dat;
    }
	
	function getFullDate(today){
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!

		var yyyy = today.getFullYear();
		if(dd<10){
		    dd='0'+dd
		} 
		if(mm<10){
		    mm='0'+mm
		} 
		var today = dd+'/'+mm+'/'+yyyy;
		return today;
	}
	
	
    function getDates(startDate, stopDate) 
    {
       var dateArray = new Array();
       var currentDate = startDate;
       while (currentDate <= stopDate) 
       {
    	 var dayNum = currentDate.getDate();
    	 if(dayNum < 10)
    	 {
    		 dayNum = "0"+dayNum;
    	 }
    	 if(currentDate.getDay() !== 0 && currentDate.getDay() !== 6) // Filter out weekends
    	 {
    		 dateArray.push({"fullDate":getFullDate(currentDate), "dayWord":weekday[currentDate.getDay()], "dayNum":dayNum, "monthWord":month[currentDate.getMonth()]})
    		 
    		 
    		 //Generate Array storing all displayed week ranges
    		 if($scope.weekArray.length == 0 || currentDate.getDay() == 1)
    		 {
    			 //Add correct number of days to get Friday
    			 switch(currentDate.getDay()) 
    			 {
    			    case 1: //Mon
    			    	var thisFriday = currentDate.addDays(4);
    			        break;
    			    case 2: //Tue
    			    	var thisFriday = currentDate.addDays(3);
    			        break;
    			    case 3: //Wed
    			    	var thisFriday = currentDate.addDays(2);
    			        break;
    			    case 4: //Thu
    			    	var thisFriday = currentDate.addDays(1);
    			        break;
    			    default: //Fri
    			    	 var thisFriday = currentDate;
    			} 
    			 $scope.weekArray.push({"fullStartDate": getFullDate(currentDate), "startDate":dayNum, "startMonth":month[currentDate.getMonth()],"endDate": thisFriday.getDate(),"endMonth":month[thisFriday.getMonth()]})
    		 }
    		 //===========================================================================================

    	 }
         currentDate = currentDate.addDays(1);
       }
       return dateArray;
     }

   
    $scope.generateDates = function() 
	{
 		var dateArray = getDates(new Date(), (new Date()).addDays(60));
 		$scope.dates = dateArray;
	}
//=====================================================================================
//END :: Generate Array of Dates
//=====================================================================================

    
	
	

//=====================================================================================
// Select Booking
//=====================================================================================
	$scope.selectBooking = function(fullDate, timeslot) 
	{
    	var bookingID = fullDate+"-"+timeslot;
    	var element= document.getElementById(bookingID);
    	
    	if(getComputedStyle(element).backgroundColor=="rgba(255, 255, 255, 0.4)")
    	{
      		element.style.background = "rgba(0, 0, 0, 0.4)";
      		$scope.selectedBookings.push(bookingID);
      		document.getElementById("makeBookingButton").style.display = "block";
      		scroll(); // Update Top button pos
    	} 
    	else if (getComputedStyle(element).backgroundColor=="rgba(0, 0, 0, 0.4)")
    	{
      		element.style.background = "rgba(255, 255, 255, 0.4)";
      		var index = $scope.selectedBookings.indexOf(bookingID);
      		if (index > -1) 
      		{
      			$scope.selectedBookings.splice(index, 1);
      			if($scope.selectedBookings.length === 0)
      			{
      				document.getElementById("makeBookingButton").style.display = "none";
      				scroll(); // Update Top button pos
      			}
      		} 
    	}
	}
//=====================================================================================
// END :: Select Booking
//=====================================================================================
	

	
	
	
//=====================================================================================
// Popup Windows
//=====================================================================================
	
	// Confirm Hire Dates/Times
	$scope.makeBooking = function() 
	{
		//if($scope.selectedBookings.length > 0)
		//{
			document.getElementById('overlay').style.display = 'block';
			disableScroll();
		//}
	}
	
	// Stat Dec Window 
	$scope.confirmConfirmation = function() 
	{
		document.getElementById('confirmBookingWindow').style.display = 'none';
		document.getElementById('statDecWindow').style.display = 'block';
	}
	
	// Delete Account Window
	$scope.deleteAccount = function() 
	{
		document.getElementById('optionsWindow').style.display = 'none';
		document.getElementById('deleteAccountWindow').style.display = 'block';
	}
	
	//Report Issue Window 
	$scope.reportIssue = function() 
	{
		document.getElementById('optionsWindow').style.display = 'none';
		document.getElementById('reportIssueWindow').style.display = 'block';
	}
	
	// Report Issue Window (Submit Issue Button Pressed)
	$scope.submitIssueReport = function()
	{
		var unsafeEntry = document.getElementById('reportIssueTextArea').value;
		var escapedEntry = unsafeEntry
		         .replace(/&/g, "&amp;")
		         .replace(/</g, "&lt;")
		         .replace(/>/g, "&gt;")
		         .replace(/"/g, "&quot;")
		         .replace(/'/g, "&#039;");
		
		if(escapedEntry.length > 0)
		{
			enableScroll();
			document.getElementById('optionsOverlay').style.display = 'none';
			document.getElementById('reportIssueWindow').style.display = 'none';
			alert(escapedEntry+"\n Thanks"); //Placeholder: Send an Email with the issue to me
			unsafeEntry.value = '';
		}
		else
		{
			alert("Issue Report Cannot be Blank.");
		}
	}
	
	//Additional Options Window 
	$scope.displayOptions = function() 
	{
		disableScroll();
		document.getElementById('optionsOverlay').style.display = 'block';
		document.getElementById('optionsWindow').style.display = 'block';
	}
	
	// Forgot Pin Window
	$scope.forgotPin = function()
	{
		document.getElementById('forgotPinOverlay').style.display = 'block';
	}
	
	// Cancel Button Pressed on Popup Window
	$scope.cancelConfirmation = function() 
	{
		enableScroll();
		document.getElementById('overlay').style.display = 'none';
		document.getElementById('optionsOverlay').style.display = 'none';
		document.getElementById('confirmBookingWindow').style.display = 'block';
		document.getElementById('statDecWindow').style.display = 'none';
		document.getElementById('deleteAccountWindow').style.display = 'none';
		document.getElementById('reportIssueWindow').style.display = 'none';
		document.getElementById('reportIssueTextArea').value = '';
		document.getElementById('forgotPinOverlay').style.display = 'none';
		document.getElementById('forgotPinEmailEntry').value = '';
		document.getElementById('cancelOverlay').style.display = 'none';
		$scope.deletePinEntered = '';
		deleteActionDisplay.innerHTML = "Please Enter your Pin";
	}	
//=====================================================================================
// END :: Popup Windows
//=====================================================================================
	 
	
	
	
	
//=====================================================================================
// Send Email to User who has forgotten their Pin
//=====================================================================================
	$scope.sendForgotPinEmail = function()
	{
		var enteredEmail = document.getElementById('forgotPinEmailEntry').value;
		if(enteredEmail.length > 0)
		{
			$scope.checkUserExists(enteredEmail, "forgotPin");
		}
		else
		{
			alert("Email address cannot be blank");
		}
	}
//=====================================================================================
// END :: Send Email to User who has forgotten their Pin
//=====================================================================================
	
	
	

	
//=====================================================================================
// Change Tab
//=====================================================================================
	$scope.openTab = function (tabName) 
    {
		  var i, x, tablinks;
		  x = document.getElementsByClassName("tabBody");
		  document.getElementById(tabName).style.display = "block";
		  
		  if(tabName=="HireABike")
		  {
				document.getElementById("noBookingsMessage").style.display = 'none';

			  myBookingsScrollPos = document.body.scrollTop;
			  document.body.scrollTop = hireBikeScrollPos;
			  
			  window.location.hash='hireabike';
			  $cookieStore.put('currentTab','hireabike');
       		  document.getElementById("MyBookings").style.display = "none";
		      document.getElementById("HireABikeTab").style.background = "#14141f";
		      document.getElementById("MyBookingsTab").style.background = "#32324e";
		  } 
		  else 
		  {
			  if($scope.myBookingsArray.length === 0)
				document.getElementById("noBookingsMessage").style.display = 'block';

			  hireBikeScrollPos = document.body.scrollTop;
			  document.body.scrollTop = myBookingsScrollPos;
			  window.location.hash='mybookings';
			  $cookieStore.put('currentTab','mybookings');
       		  document.getElementById("HireABike").style.display = "none";
		      document.getElementById("HireABikeTab").style.background = "#32324e";
		      document.getElementById("MyBookingsTab").style.background = "#14141f";
		      $scope.displayMyBookingsContent();		      			  
		  }
		scroll();  
	}
//=====================================================================================
// END :: Change Tab
//=====================================================================================	


	
	
	
//=====================================================================================
// Jump To Week
//=====================================================================================
	$scope.showDropdown = function () 
	{
		 document.getElementById("jumpToWeekDropdown").classList.toggle("show");
	}
	
	//Close Drop Down Menu
	window.onclick = function(event) {
		  if (!event.target.matches('.jumpToWeekButton') && !event.target.matches('.downArrow') ) {

		    var dropdowns = document.getElementsByClassName("jumpToWeekDropdown");
		    var i;
		    for (i = 0; i < dropdowns.length; i++) {
		      var openDropdown = dropdowns[i];
		      if (openDropdown.classList.contains('show')) {
		        openDropdown.classList.remove('show');
		      }
		    }
		  }
		}
	
//=====================================================================================
// END :: Jump To Week
//=====================================================================================	

	
	

//=====================================================================================
// Page Scroll
//=====================================================================================		
	function scroll() 
	{
		var returnToTopButton = document.getElementById("returnToTopButton");
		
		//Display Top Button
		if(document.body.scrollTop >= 1350 && returnToTopButton.style.display === '')
		{
			returnToTopButton.style.display = 'block';
		}
		else if (document.body.scrollTop < 1350 && returnToTopButton.style.display === 'block')
		{
			returnToTopButton.style.display = '';
		}
		
		//Align Top Button with make Booking Button
		if(document.getElementById("makeBookingButton").style.display === 'block')
		{
			returnToTopButton.style.bottom='250px';
		}
		else
		{
			returnToTopButton.style.bottom='50px';
		}
			
		var navPanel = document.getElementById('navPanel');
		var jumpToWeek = document.getElementById('jumpToWeek');
		
		//Container
		var navPanelContainer = document.getElementById('navPanelContainer');
		var navPanelContainerRect = navPanelContainer.getBoundingClientRect();
		var headerElement = document.getElementById("header");
		var headerRect = headerElement.getBoundingClientRect();
		
		if(document.body.scrollTop < headerElement.offsetHeight)
		{
			navPanel.style.top = headerElement.offsetHeight +"px";
			navPanel.style.position = 'absolute';
			jumpToWeek.style.top = headerElement.offsetHeight+navPanel.offsetHeight +"px";
			jumpToWeek.style.position = 'absolute';
		}
		else
		{
			navPanel.style.top = '0px';
			navPanel.style.position = 'fixed';
			jumpToWeek.style.top = navPanel.offsetHeight+'px';
			jumpToWeek.style.position = 'fixed';
		}
	}
//=====================================================================================
// END :: Page Scroll
//=====================================================================================
	

	
	
	
//=====================================================================================
// Scroll to Week Start
//=====================================================================================	
$scope.scrollToWeek = function(startDate)
{
	var dateElement = document.getElementById(startDate+"-1");
	var elementPos = dateElement.offsetTop - dateElement.offsetHeight;
	//Scroll Down
	if(document.body.scrollTop < elementPos)
	{
		var id = setInterval(frame, 1);
		function frame() 
		{
			if (document.body.scrollTop >= elementPos) 
		    {
				document.body.scrollTop = elementPos;
				clearInterval(id);
		    } 
		    else 
		    {
		    	document.body.scrollTop+=100; 
		    }
		}
	}
	//Scroll Up
	else if(document.body.scrollTop > elementPos)
	{
		var id = setInterval(frame, 1);
		function frame() 
		{
			if (document.body.scrollTop <= elementPos) 
		    {
				document.body.scrollTop = elementPos;
				clearInterval(id);
		    } 
		    else 
		    {
		    	document.body.scrollTop-=100; 
		    }
		}
	}
}
//=====================================================================================
// END :: Scroll to Week Start
//=====================================================================================	
	
	
	
	
	
//=====================================================================================
// Return To Top of Page
//=====================================================================================	
$scope.returnToTop = function ()
{
	/*var elem = document.body.scrollTop;   
	var pos = document.body.scrollTop;*/
	var id = setInterval(frame, 1);
	function frame() 
	{
		if (document.body.scrollTop == 0) 
	    {
			clearInterval(id);
	    } 
	    else 
	    {
	    	document.body.scrollTop-=100; 
	    }
	}
}	
//=====================================================================================
// END :: Return To Top of Page 
//=====================================================================================	
	
	
	
	
//=====================================================================================
// Prevent Scrolling When Popup Window Is Displayed 
//=====================================================================================	
	// left: 37, up: 38, right: 39, down: 40,
	// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
	var keys = {37: 1, 38: 1, 39: 1, 40: 1, 32: 1,33: 1,34: 1,35: 1,36: 1};

	window.onkeyup = function(e) {
		   var key = e.keyCode ? e.keyCode : e.which;
		   if (keys[e.keyCode]) {
		        preventDefault(e);
		        return false;
		    }
		}
	
	function preventDefault(e) {
	  e = e || window.event;
	  if (e.preventDefault)
	      e.preventDefault();
	  e.returnValue = false;  
	}

	function preventDefaultForScrollKeys(e) {
	    if (keys[e.keyCode]) {
	        preventDefault(e);
	        return false;
	    }
	}

	function disableScroll() {
		  window.onwheel = preventDefault;
		  window.onmousewheel = document.onmousewheel = preventDefault;
		  window.ontouchmove  = preventDefault;
		  document.onkeydown  = preventDefaultForScrollKeys;
		}

	function enableScroll() {
		    window.onmousewheel = document.onmousewheel = null; 
		    window.onwheel = null; 
		    window.ontouchmove = null;  
		    document.onkeydown = null;  
		}
	
	
	
//=====================================================================================
// END :: Prevent Scrolling When Popup Window Is Displayed 
//=====================================================================================	
	
	
	
//=====================================================================================
// Check if user is logged in
//=====================================================================================
	var cookieUser = $cookieStore.get('currentUser');
	var initialMyBookings = false; // Page was refreshed on the My Bookings Tab
	if(!angular.isUndefined(cookieUser))
	{
		document.getElementById('login').style.display='none';
		var cookieCurrentTab = $cookieStore.get('currentTab');
		window.location.hash= cookieCurrentTab;
		$scope.currentUser = cookieUser;
		$scope.generateDates();
		$scope.getBookings();				
		if(cookieCurrentTab == 'hireabike')
		{
			$scope.openTab("HireABike");
		}
		else if(cookieCurrentTab == 'mybookings')
		{
			initialMyBookings = true;
			$scope.openTab("MyBookings");
		}
	}
//=====================================================================================
// END :: Check if user is logged in
//=====================================================================================
});

