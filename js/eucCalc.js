	function eucCalc(e) {

		var reducPercentage = .107,
			minEUC = 64,
			maxEUC = 405,
			ecuError = document.getElementById('ecu-error'),
			resultsBox = document.getElementById('ecu-results'),
			ecuTotal = document.getElementById('euc-total'),
			ecuInput = document.getElementById('euc').value,
			newEUC;
		// Variables
		

		if (isNaN(parseInt(ecuInput))) {

			// Blank our the results
			newEUC = "";

			// Hide Result Box on invalid values
			resultsBox.style.display = "none";
			ecuError.style.display="block";
		} else {

			// Turn the textbox value into a number
			ecuInput = parseInt(ecuInput);
			if (ecuInput >= 64 && ecuInput <= 405) {
				//calculate
				newEUC = (ecuInput - (ecuInput * reducPercentage));
				
				// Enter the number onto the page
				ecuTotal.innerHTML = Math.floor(newEUC);
				
				//display results
				ecuError.style.display="none";
				resultsBox.style.display="block";
			} else {
				//display error
				resultsBox.style.display="none";
				ecuError.style.display="block";
			}
		}
	}