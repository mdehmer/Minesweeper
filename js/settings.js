// ===================================================
// EVENT LISTERNERS
// ===================================================

// Event listener for disabling the right-click context menu
$(document).on('contextmenu', function (event) {
	// Prevent the default right-click behavior (context menu)
	event.preventDefault();
});

// Event listener for the default settings checkbox
$('#checkDefaultSettings').on('change', function () {
	if ($('#checkDefaultSettings').prop('checked')) {
		calculateRecommendedSettings();
	}
});

// Event listener for updating the number of rows label
$('#rowRange').on('input', function () {
	var colValue = $('#columnRange').val();
	var rowValue = $('#rowRange').val();

	$('#rowRangeLabel').text(rowValue);
	$('#checkDefaultSettings').prop('checked', false);
	$('#numCellsText').text(
		'Total: ' + (colValue * rowValue) + ' tiles'
	);

	if (numMines >= (rowValue * colValue)) {
		numMines = (rowValue * colValue) - 1;
		minMaxGrid.maxMine = numMines;
		$('#mineRange').attr('max', minMaxGrid.maxMine);
	}

	// updateRangeValues();

	calculateDifficultyLevel();
});

// Event listener for updating the number of columns label
$('#columnRange').on('input', function () {
	$('#columnRangeLabel').text($('#columnRange').val());
	$('#checkDefaultSettings').prop('checked', false);
	$('#numCellsText').text(
		'Total: ' + $('#columnRange').val() * $('#rowRange').val() + ' tiles'
	);
	// updateRangeValues();

	calculateDifficultyLevel();
})

// Event listener for updating the number of columns label
$('#mineRange').on('input', function () {
	$('#mineRangeLabel').text($('#mineRange').val());
	$('#checkDefaultSettings').prop('checked', false);
	// updateRangeValues();

	calculateDifficultyLevel();
})

// Event listener for the color mode toggle
$('#colorModeSwitch').on('input', function (e) {
	console.log(e);
	if (e.target.checked) {
		$("html").attr("data-bs-theme", "dark");
		$(".form-switch .form-check-label").text("Dark");
		$("#colorModeSwitch").prop("checked", true);
	} else {
		$("html").attr("data-bs-theme", "light");
		$(".form-switch .form-check-label").text("Light");
		$("#colorModeSwitch").prop("checked", false);
	}
});


// Event listener for pressing the "Save changes" button
$('#saveBtn').on('click', function (e) {
	e.preventDefault(); // Prevent the default form submission

	// Get the selected values from the dropdowns
	numMines = $('#mineRange').val();
	numRows = $('#rowRange').val();
	numCols = $('#columnRange').val();

	// Update the game settings based on the selected values
	gameStarted = false;
	numFlagsPlaced = numMines;
	localStorage.setItem('numRows', numRows);
	localStorage.setItem('numCols', numCols);
	localStorage.setItem('numMines', numMines);
	if ($("#checkDefaultSettings").prop("checked")) {
		localStorage.setItem('usingDefaultSettings', true);
	} else {
		localStorage.setItem('usingDefaultSettings', false);
	}

	localStorage.setItem('usingDefaultSettings', $("#checkDefaultSettings").prop("checked") === true ? true : false);
	$('#numRemainingMines').removeClass('text-danger');
	localStorage.setItem("colorMode", $("html").attr("data-bs-theme"));

	//Reset the timer
	minutes = 0;
	seconds = 0;
	$('#seconds').text('00');
	$('#minutes').text('00');

	loadCoveredBoard();
});

// ===================================================
// SETTINGS LOGIC
// ===================================================

function loadSettings() {
	// If there are previous settings saved in local storage and the usingDefaultSettings is not true i.e. the user has customized their settings
	if (
		localStorage.length > 0 &&
		localStorage.getItem('usingDefaultSettings') !== true
	) {
		// Then set the localStorage item and checkbox to false
		localStorage.setItem('usingDefaultSettings', false);
		$('#checkDefaultSettings').prop('checked', false);
		// Else if the checkbox is set to true
	} else if ($('#checkDefaultSettings').prop('checked')) {
		// Then apply recommended settings
		calculateRecommendedSettings();
		localStorage.setItem('usingDefaultSettings', true);
	}

	if (Number(localStorage.getItem('numRows')) !== 0) {
		numRows = Number(localStorage.getItem('numRows'));

	} else {
		numRows = $('#rowRange').val();
	}

	if (Number(localStorage.getItem('numCols')) !== 0) {
		numCols = Number(localStorage.getItem('numCols'));
	} else {
		numCols = $('#columnRange').val();
	}

	if (Number(localStorage.getItem('numMines')) !== 0) {
		numMines = Number(localStorage.getItem('numMines'));
	} else {
		numMines = $('#mineRange').val();
	}

	if (localStorage.getItem('colorMode') !== null) {

		var savedColorMode = localStorage.getItem('colorMode');
		var label = savedColorMode.slice(0, 1).toUpperCase() + savedColorMode.slice(1);

		$("html").attr("data-bs-theme", (savedColorMode !== null ? savedColorMode : "light"));
		$("#colorModeSwitch").prop("checked", (savedColorMode === "dark" ? true : false));
		$(".form-switch .form-check-label").text(label);
	}

	numCells = numCols * numRows;
	$('#numCellsText').text('Total: ' + $('#columnRange').val() * $('#rowRange').val() + ' tiles');
	numFlagsPlaced = numMines;

	updateRangeValues("");
	calculateDifficultyLevel();
	// calculateGridSize();
}

function calculateRecommendedSettings() {
	numCols = minMaxGrid.maxCol;
	$('#columnRange').val(numCols);
	$('#columnRangeLabel').text(numCols);

	numRows = minMaxGrid.maxRow;
	$('#rowRange').val(numRows);
	$('#rowRangeLabel').text(numRows);

	numCells = numRows * numCols;

	numMines = Math.floor(numCells * 0.07);
	numFlagsPlaced = numMines;
	$('#mineRange').val(numMines);
	$('#mineRangeLabel').text(numMines);
	$('#numCellsText').text('Total: ' + numCells + ' tiles');
	calculateDifficultyLevel();
}

function updateRangeValues([rangesToUpdate]) {
	minMaxGrid = new MinMaxGrid();

	$('#rowRange').val(localStorage.getItem('numRows'));
	$('#rowRangeLabel').text($('#rowRange').val());
	$('#rowRange').attr('min', minMaxGrid.minRow);
	$('#rowRange').attr('max', minMaxGrid.maxRow);
	$('#columnRange').val(localStorage.getItem('numCols'));
	$('#columnRangeLabel').text($('#columnRange').val());
	$('#columnRange').attr('min', minMaxGrid.minCol);
	$('#columnRange').attr('max', minMaxGrid.maxCol);
	$('#mineRange').val(localStorage.getItem('numMines'));
	$('#mineRangeLabel').text($('#mineRange').val());
	$('#mineRange').attr('min', minMaxGrid.minMine);
	$('#mineRange').attr('max', minMaxGrid.maxMine);

}

function calculateGridSize() {
	if ($(window).width() > $(window).height()) {
		$('.boardRow').css('height', maxHeight / numRows);
		$('.boardCell').css('width', maxHeight / numCols);
	} else {
		$('.boardRow').css('height', maxWidth / numRows);
		$('.boardCell').css('width', maxWidth / numCols);
	}
}

function calculateDifficultyLevel() {
	var cellValue = $('#rowRange').val() * $('#columnRange').val();
	var mineValue = $('#mineRange').val();
	var currentDifficulty = (cellValue / mineValue) / 100;

	// minMaxGrid.maxMine = cellValue;
	// $('#mineRange').attr('max', (minMaxGrid.maxMine * 0.9));


	if (currentDifficulty <= 0.0574) {
		// Extreme
		$('#difficultyText').html(
			'Difficulty: <span class="badge text-bg-danger">Extreme</span>'
		);
	} else if (currentDifficulty >= 0.0575 && currentDifficulty <= 0.104) {
		// Hard
		$('#difficultyText').html(
			'Difficulty: <span class="badge text-bg-warning">Hard</span>'
		);
	} else if (currentDifficulty >= 0.105 && currentDifficulty <= 0.1524) {
		// Medium
		$('#difficultyText').html(
			'Difficulty: <span class="badge text-bg-primary">Medium</span>'
		);
	} else if (currentDifficulty >= 0.1525 && currentDifficulty <= 0.20) {
		// Easy
		$('#difficultyText').html(
			'Difficulty: <span class="badge text-bg-success">Easy</span>'
		);
	}
}

function MinMaxGrid() {
	this.minCol = 5;
	this.minRow = 5;
	this.maxCol = Math.floor(maxWidth / minSize);
	this.maxRow = Math.floor(maxHeight / minSize);
	this.minMine = Math.round((this.minCol * this.minRow) * 0.02);
	this.maxMine = Math.floor((this.maxCol * this.maxRow) * 0.2);
}
