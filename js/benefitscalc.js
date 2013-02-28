// Function is used to check to make sure the value in the date input box is a date.
function date_check(date) {

  if (isDate(date) == false){
    return false;
  }else{
    return datesplitprocess( date );
  }
}

// Function is used to find the difference between two different dates.
function weekdiff(date1, date2) {

  var numberDays = /*Math.ceil*/((date2.getTime() - date1.getTime()) / (86400000)); // 86400000 is number of milliseconds in one day  
  // number of days = ( date2.inMilliSecs - date1.inMilliSecs ) / 1day.inMilliSecs
  var numberWeeks = ( Math.floor(numberDays) / 7) ;
  //if (Math.floor(numberDays % 7) != 0) {
  //  numberWeeks -= 1;
  //}

  return Math.ceil(numberWeeks); // round to whole before return
}

function datesplitprocess(date) {
	sp = date.split('/');
    return oDate(sp[2],sp[0],sp[1]);
}
function oDate(year, month, day ){
	
  var mth = month-1;
  var mydate = new Date(0);
  mydate.setFullYear(year, mth, day);
  return mydate;
}

//range object
function Range( startDate, endDate, baseWeeks, variableWeeks, resultDiv ) {
	this.startDate = datesplitprocess(startDate); // range start date
	this.endDate = datesplitprocess(endDate); // range end date
	this.baseWeeks = baseWeeks; // base number of weeks to use for calculation
	if(variableWeeks) {
		this.isVary = true; // is variable weeks
	} else {
		this.isVary = false; // is not variable weeks (constant)
	}
	this.resultDiv = resultDiv; // resulting div that should be displayed
}

// On page load.
$(document).ready(function() {
  
	// Other Global Variables
	var numWeeks = '';
	var ocRange = '';
	var inDate = '';
	var rangesArray = [];
  
	function createRangeObject() {
	// Key dates (Put all dates that will be used to check against here)
	  return [
		// new Range ( 'startDate', 'endDate', MaxNumberofWeeks, variable (boolean), divID_for_results )
		new Range( '01/01/1970', '04/30/2006', 99, false, 'qualRange-'),// dummy range = invalid
		new Range( '05/01/2006', '09/08/2008', 99, false, 'qualRangeA'),
		new Range( '09/15/2008', '03/16/2009', 99, false, 'qualRangeB'),
		new Range( '03/23/2009', '08/09/2010', 99, false, 'qualRangeC'),
		new Range( '08/16/2010', '11/15/2010', 99, false, 'qualRangeD'),
		//new Range( '12/13/2010', '12/27/2010', 99, true,  'qualRangeD'), //split D into two, since it contains constant and variable.
		new Range( '11/22/2010', '12/27/2010', 98, true,  'qualRangeE'),
		new Range( '01/03/2011', '02/28/2011', 92, false, 'qualRangeF'),
		new Range( '03/07/2011', '04/04/2011', 91, true,  'qualRangeF'), //split F into two, since it contains constant and variable.
		new Range( '04/11/2011', '07/04/2011', 86, true,  'qualRangeG'),
		new Range( '07/11/2011', '08/01/2011', 73, true,  'qualRangeH'),
		new Range( '08/08/2011', '10/10/2011', 69, false, 'qualRangeI'),
		new Range( '10/17/2011', '02/20/2012', 69, false,  'qualRangeJ'),
		new Range( '02/27/2012', '10/08/2012', 63, false,  'qualRangeK'),
		new Range( '10/15/2012', '12/03/2012', 62, true,  'qualRangeL'),
		new Range( '12/10/2012', '03/12/2013', 54, true,  'qualRangeM'),
		new Range( '03/18/2013', '06/17/2013', 40, true,  'qualRangeN'),
		new Range( '06/24/2013', '12/31/9999', 26, false, 'qualRangeZ')
	  ];
	}
  
	//Function used to check what benefits a person is eligible for. 
	function showResults(date, qualRange, qualRangeString) {
		$('#numWeeks').text(qualRange);
		$('#inDate').text(date);

		var resultSet = (qualRangeString == '') ? ('') : ('.' + qualRangeString);
		// Display results.
		$('div.display').slideDown("slow");
		$(resultSet).slideDown("slow");
	}
	
	// function to process the date, and figure out which range the date belongs to.	
	/*
	*********dp0vn3 2012/09/13
	*/
	function processInputDate( ocDate, inputDate ) {
		if (rangesArray.length == 0) {
			rangesArray = createRangeObject();
		}
		var displayNumWeeks = '';
		var resultDiv = null;
		var date = ocDate;
		var i=0;
		for ( i=rangesArray.length; i>0; i--) {
			//reverse loop thru the array
			
			
			/* EXAMPLE:
			 *      // 03/19/2012 - 06/24/2012
					else if ( (checkedDate>qualDate19) ) { 
						var calwks = qualRange_K - weekdiff( qualDate20, checkedDate ); 
						showResults(ocdate, calwks, 'qualRangeK');
					} 
			 *
			 *     qualDate19 = enddate of previous range, if checkedDate > qualDate19, effective OCDate = start of rangeK 
			 *     calwks = max weeks of Benefits in rangeK - ( diff weeks between ( checkedDate & startofrangeK ) )
			 *
			**/ 
			
			
			if ( (rangesArray[i-1] ) 
				&& (inputDate > rangesArray[i-1].endDate) 
			) {  
				if (rangesArray[i].isVary) {
					displayNumWeeks = rangesArray[i].baseWeeks - weekdiff( rangesArray[i].startDate , inputDate ); 
				} else {
					displayNumWeeks = rangesArray[i].baseWeeks;
				}
				showResults( date, displayNumWeeks, rangesArray[i].resultDiv );
				break; // break out of loop
			}
		}
		if (i==0) {
			//finished loop, cannot find date
			$('#numWeeks').text( '' );
			$('#inDate').text( '' );
			$('div.display').hide();
			$('div.ocrange-all').hide();    
			$('div.errMsg').slideDown("slow");
		}
	}  

    
  // Initially hide everything
  $(".errMsg").hide();
  $('div.display').hide();
  $('.ocrange-all').hide();   
  
  
  // UI Button Click.
  $('#calculate-button').on( 'click', function(){
    // Call function to see if date entered is a real date
    var ocdate = $('#certDateInput').val();
    var checkedDate = date_check(ocdate);
    
    if (checkedDate == false) {
		$('div.display').hide();
		$('div.ocrange-all').hide();    
		$('div.errMsg').slideDown("slow");
    } else {
	  
		// Hide error and show results.
		$('div.errMsg').hide();
		$('div.display').hide();
		$('div.ocrange-all').hide();      

		// Now we need to check to see what benefits a person might be eligible for based on the unemployment chart.
		processInputDate(ocdate, checkedDate);

		// 
    }
  }) ;// end click
  
  
});
