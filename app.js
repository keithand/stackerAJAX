$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});

	$('.inspiration-getter').submit(function(event) {
		$('.results').html('');
		var answerers = $(this).find("input[name='answerers']").val();
		getAnswerers(answerers);
	});
});

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};


var showAnswerer = function(tag_score){
	//make a clone of the template top_answers in HTML page
	var result = $(".templates top_answers").clone();

	var profileImage = result.find('.profile-image');
	profileImage.html('<img src="' + tag_score.user.profile_image + '" alt="profile_image">')

	var topAnswerer = result.find('.top-answerers');
	topAnswerer.text(tag_score.user.display_name);

	var reputation = result.find('.reputation');
	reputation.text(tag_score.user.reputation);

	var postCount = result.find('.post-count');
	postCount.text(tag_score.post_count);

	var score = result.find('.score');
	score.text(tag_score.score);

	return result;
};


// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(answerers) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: answerers,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getAnswerers = function(tags) {

	var request =	{tagged: tags,
					site: 'stackoverflow',
					order: 'desc',
					sort: 'creation'};

	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/tags/{tag}/top-answerers/all_time?site=stackoverflow",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){ 
		var searchResults = showSearchResults(request.tagged, result.items.length);
		$(".search-results").html(searchResults);

		$.each(result.items, function(i, item) {
			var answerer = showAnswerer(item);
			$('.results').append(tag_score);
		});

	})

};



