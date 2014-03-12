$(function() {

	var suits = ["Club", "Spade", "Diamond", "Heart"];
	var randomSuit;

	var ranks = ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"];
	var randomRank;

	var playerHand = [];

	function dealCard() {
			randomSuit = Math.round(Math.random() * 3);
			randomRank = Math.round(Math.random() * 12);

			return [randomSuit, randomRank];

	}

	function renderHand(num) {
		var currentCard;
		var currentRank;
		var currentSuit;

		for ( var i=0; i <= num - 1; i++ ) {

			currentCard = playerHand[i];
			currentRank = currentCard[1];
			currentSuit = currentCard[0];

			$(".playArea").append('<div class="card' + i + ' cardContainer"><img src="img/cards/card' + suits[currentSuit] + ranks[currentRank] + '.jpg" alt="' + ranks[currentRank] + ' of ' + suits[currentSuit] + '" class="' + suits[currentSuit] + ranks[currentRank] + '"></div>')
		};
	}

	function dealHand(cardQty) {
		for ( var i=0; i <= cardQty - 1; i++ ) {
			playerHand[i] = dealCard();
		}

		renderHand(cardQty);
	}

	$(".deal").click(function(e) {
		$(".playArea").empty();

		dealHand(3);

		$(".card2 > img").hide();
	});

	var betAmount;
	var bankBal = 5000;

	$(".bet").click(function(e) {
		betAmount = prompt("Your bank is currently at " + bankBal + ". How much would you like to bet?");//

		$(".card2 > img").show();


//		if (betAmount <= 0) {
//			betAmount = prompt("You have to bet to see the next card. Your bank is currently at " + bankBal + ". How much would you like to bet?");
//		} else if (Number.isNaN(betAmount) !== true) {
//			betAmount = prompt("That is an invalid bet. Your bank is currently at " + bankBal + ". How much would you like to bet?");
//		} else {
//
//		};
	});
});