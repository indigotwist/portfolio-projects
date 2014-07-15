//written by Levi Stephen for final project of Web Dev 2 - Fall 2013
//Send any comments or bugs to levi@deepindigodesign.com

$(function() {

	var shuffledDeck,
		playerHand = [],
		dealerHand = [],
		bankBalance = 5000,
		anteBetAmt = 25,
		pairPlusAmt = 25,
		playBetAmt,
		rankedPlayerHand = [],
		rankedDealerHand = [],
		pairHighCard,
		playerPairHighCard,
		dealerPairHighCard,
		playerHandValue,
		dealerHandValue;

	//Creates a 52-card Poker-style Deck
	function cardDeck() {
		var cardNames = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];
		var suits = ["Club", "Diamond", "Heart", "Spade"];
		var newDeck = [];

		for (var i=0; i < cardNames.length; i++) {
			for (var j=0; j < suits.length; j++) {
				newDeck.push({
					cardName: cardNames[i],
					suit: suits[j],
					rank: i + 1
				});
			}
		}

		return newDeck;
	}

	//Shuffles the deck of cards
	function shuffleCards() {
		shuffledDeck = _.shuffle(cardDeck());

		return shuffledDeck;
	}

	shuffledDeck = shuffleCards();

	//Displays each card in the hand entered
	function renderHand(hand, selector) {
		var card;

		for ( var i=0; i < hand.length; i++ ) {

			card = hand[i];

			$(selector).append('<div class="card'
				+ i + '"><img src="img/cards/card'
				+ card.suit + card.cardName + '.jpg" alt="'
				+ card.cardName + ' of ' + card.suit + '" class="'
				+ card.suit + card.cardName + '"></div>')
		};
	}

	//Deals the entered amount of cards to an array
	function dealHand(cardQty) {
		var hand = [];

		for ( var i = 0; i < cardQty; i++ ) {
			if (shuffledDeck.length < 1) {
				shuffledDeck = shuffleCards();
			}

			hand[i] = shuffledDeck.pop();
		}

		return hand;
	}

	//Checks for emptiness
	function validateNotEmpty(selector) {
		if ($(selector).val().length == 0) {
			$(selector).next("span").show();
			return false;

		} else {
			$(selector).next("span").hide();
			return true;
		}
	}

	//Checks that an entered value is between an entered range
	function validateRange(selector,min,max) {
		var inputVal = $(selector).val();

		if (inputVal > min && inputVal < max) {
			$(selector).next("span").hide();
			return true;

		} else {
			$(selector).next("span").show();
			return false;
		}
	}

	//Determines 0 and null as valid values
	function validateZeroOkay(selector) {
		var inputVal = $(selector).val();

		if (inputVal.length == 0) {
			$(selector).next("span").hide();
			return true;

		} else if (inputVal == 0) {
			$(selector).next("span").hide();
			return true;

		} else {
			return false;
		}
	}

	/* Rearranges an entered array's objects into ascending ordered
	indexes determined by the object's rank value */
	function rankCardsInHand(hand) {
		var rankedHand =[];

		if (hand[0].rank > hand[1].rank) {
			if (hand[0].rank > hand[2].rank) {
				rankedHand[2] = hand[0];

				if (hand[1].rank > hand[2].rank) {
					rankedHand[1] = hand[1];
					rankedHand[0] = hand[2];
				} else {
					rankedHand[1] = hand[2];
					rankedHand[0] = hand[1];
				}

			} else {
				rankedHand[2] = hand[2];
				rankedHand[1] = hand[0];
				rankedHand[0] = hand[1];
			}

		} else if (hand[2].rank > hand[1].rank) {
			rankedHand[2] = hand[2];
			rankedHand[1] = hand[1];
			rankedHand[0] = hand[0];

		} else {
			rankedHand[2] = hand[1];

			if (hand[0].rank > hand[2].rank) {
				rankedHand[1] = hand[0];
				rankedHand[0] = hand[2];
			} else {
				rankedHand[1] = hand[2];
				rankedHand[0] = hand[0];
			}
		}

		return rankedHand;
	}

	/* Checks for a Pair of cards in the entered hand,
	also determines the high card to compare in the case of a tied Pair*/
	function validatePair(hand) {
		if (hand[1].rank == hand[2].rank || hand[1].rank == hand[0].rank) {
			if (hand[1].rank == hand[2].rank) {
				pairHighCard = hand[0].rank;

			} else {
				pairHighCard = hand[2].rank;
			}

			return true;

		} else {
			return false;
		}
	}

	//Checks for a Flush in the entered hand
	function validateFlush(hand) {
		if (hand[2].suit == hand[1].suit && hand[1].suit == hand[0].suit) {
			return true;
		} else {
			return false;
		}
	}

	//Checks for a Straight in the entered hand
	function validateStraight(hand) {
		if (hand[2].rank == 13 && hand[0].rank + hand[1].rank == 3) {
			hand[2].rank = 0;

			hand = rankCardsInHand(hand);

			return true;

		} else if (hand[2].rank - 1 == hand[1].rank && hand[1].rank - 1 == hand[0].rank) {
			return true;

		} else {
			return false;
		}
	}

	//Checks for a 3-of-a-Kind in the entered hand
	function validate3Kind(hand) {
		if (validatePair(hand) && hand[1].rank == hand[0].rank && hand[1].rank == hand[2].rank) {
			return true;
		} else {
			return false;
		}
	}

	//Determines the category of the entered hand and returns a value in order to compare
	function findHandValue(hand) {
		var handValue;

		if (validateStraight(hand) && validateFlush(hand)) {
			handValue = 250;
		} else if (validate3Kind(hand)) {
			handValue = 200;
		} else if (validateStraight(hand)) {
			handValue = 150;
		} else if (validateFlush(hand)) {
			handValue = 100;
		} else if (validatePair(hand)) {
			handValue = 50;
		} else {
			handValue = hand[2].rank;
		}

		return handValue;
	}

	//Applies Pair Plus Bonus
	function pairPlusBonus(hand) {
		if (hand == 50) {
			bankBalance += pairPlusAmt;
		} else if (hand == 100) {
			bankBalance += pairPlusAmt * 4;
		} else if (hand == 150) {
			bankBalance += pairPlusAmt * 5;
		} else if (hand == 200) {
			bankBalance += pairPlusAmt * 30;
		} else if (hand == 250) {
			bankBalance += pairPlusAmt * 40;
		} else {
			bankBalance -= pairPlusAmt;
		}
	}

	//Applies Ante Bonus
	function anteBonus(hand) {
		if (hand == 150) {
			bankBalance += anteBetAmt;
		} else if (hand == 200) {
			bankBalance += anteBetAmt * 4;
		} else if (hand == 250) {
			bankBalance += anteBetAmt * 5;
		}
	}

	//Player win outcome
	function outcomePlayerWin() {
		$(".outcome").html('<img src="img/outcomeWin.png" alt="You Win">');

		bankBalance += anteBetAmt;
		bankBalance += playBetAmt;
	}

	//Dealer win outcome
	function outcomeDealerWin() {
		$(".outcome").html('<img src="img/outcomeLose.png" alt="Dealer Wins">');

		bankBalance -= anteBetAmt;
		bankBalance -= playBetAmt;
	}

	//Tie outcome
	function outcomeTie() {
		$(".outcome").html('<img src="img/outcomeTie.png" alt="Tie">');
	}

	//Compares the hand's values to determine an outcome, hand1 should be Player's hand and hand2 should be Dealer's
	function compareHands(hand1,hand2) {
		if (hand2 < 11) {
			$(".outcome").html('<img src="img/outcomeDNQ.png" alt="Dealer Not Qualifed">');

			bankBalance += anteBetAmt;

			return;

		} else if (hand1 > hand2) {
			outcomePlayerWin();

		} else if (hand1 == hand2) {
			if (hand1 == 50) {
				if (rankedPlayerHand[1].rank > rankedDealerHand[1].rank) {
					outcomePlayerWin();

				} else if (rankedPlayerHand[1].rank == rankedDealerHand[1].rank) {
					if (playerPairHighCard > dealerPairHighCard) {
						outcomePlayerWin();

					} else if (playerPairHighCard == dealerPairHighCard) {
						outcomeTie();

					} else {
						outcomeDealerWin();
					}

				} else {
					outcomeDealerWin();
				}

			} else {
				if (rankedPlayerHand[2].rank > rankedDealerHand[2].rank) {
					outcomePlayerWin();

				} else if (rankedPlayerHand[2].rank == rankedDealerHand[2].rank) {
					if (rankedPlayerHand[1].rank > rankedDealerHand[1].rank) {
						outcomePlayerWin();

					} else if (rankedPlayerHand[1].rank == rankedDealerHand[1].rank) {
						if (rankedPlayerHand[0].rank > rankedDealerHand[0].rank) {
							outcomePlayerWin();

						} else if (rankedPlayerHand[0].rank == rankedDealerHand[0].rank) {
							outcomeTie();

						} else {
							outcomeDealerWin();
						}

					} else {
						outcomeDealerWin();
					}

				} else {
					outcomeDealerWin();
				}
			}

		} else {
			outcomeDealerWin();
		}
	}

	//Displays the Bank Roll amount
	function renderBankRoll() {
		$(".bankRoll").text("$" + bankBalance);
	}

	renderBankRoll();

	//Displays a default value in the Ante and Pair Plus fields
	function renderDefaultValue(selector,value) {
		$(selector).val(value);
	}

	renderDefaultValue("#anteBet",25);
	renderDefaultValue("#pairPlusBet",25);

	//Hides the error messages until they are activated
	$("#pairPlusHelp").hide();
	$("#anteHelp").hide();

	/* Validates the value entered in the Ante bet when focus leaves the input,
	also makes the entry of a value mandatory */
	$("#anteBet").blur(function() {
		if (validateNotEmpty(this) == true) {
			validateRange(this,0,bankBalance);
		}
	});

	/* Validates the value entered in the Pair Plus bet when focus leaves the input,
	also makes the entry of a value optional */
	$("#pairPlusBet").blur(function() {
		if (validateZeroOkay(this) == false) {
			validateRange(this,0,bankBalance);
		}
	});

	//Determines the sequence of events after clicking the Deal button
	$(".deal").click(function() {
		$("#playBet").val("");

		$(".dealerPlayArea").empty();

		$(".playerPlayArea").empty();

		$(".dealerHide").show();

		$(".outcome").html("");

		if (validateNotEmpty("#anteBet") == false) {
			return;
		}

		if (validateRange("#anteBet",0,bankBalance) == false) {
			return;
		}

		if (validateZeroOkay("#pairPlusBet") == false) {
			if (validateRange("#pairPlusBet",0,bankBalance) == false) {
				return;
			}
		}

		anteBetAmt = parseFloat($("#anteBet").val());

		pairPlusAmt = parseFloat(+$("#pairPlusBet").val());

		$("#anteBet").prop("disabled", true);

		$("#pairPlusBet").prop("disabled", true);

		playerHand = dealHand(3);

		dealerHand = dealHand(3);

		renderHand(playerHand,".playerPlayArea");

		renderHand(dealerHand,".dealerPlayArea");

		rankedPlayerHand = rankCardsInHand(playerHand);

		rankedDealerHand = rankCardsInHand(dealerHand);

		playerHandValue = findHandValue(rankedPlayerHand);

		if (playerHandValue == 50) {
			playerPairHighCard = pairHighCard;
		}

		dealerHandValue = findHandValue(rankedDealerHand);

		if (dealerHandValue == 50) {
			dealerPairHighCard = pairHighCard;
		}

		$(this).prop("disabled", true);

		$(".play").prop("disabled", false);

		$(".fold").prop("disabled", false);
	});

	//Determines the sequence of events after clicking the Play button
	$(".play").click(function() {
		$("#playBet").val(anteBetAmt);

		playBetAmt = parseFloat($("#playBet").val());

		$(".dealerHide").hide();

		compareHands(playerHandValue,dealerHandValue);

		pairPlusBonus(playerHandValue);

		anteBonus(playerHandValue);

		renderBankRoll();

		$(this).prop("disabled", true);

		$(".deal").prop("disabled", false);

		$(".fold").prop("disabled", true);

		$("#anteBet").prop("disabled", false);

		$("#pairPlusBet").prop("disabled", false);

		//Determines if the Bank Roll is empty and asks to restart the game if it is
		if (bankBalance <= 0) {
			$(".deal").prop("disabled", true);
			$(".play").prop("disabled", true);
			$(".fold").prop("disabled", true);
			$("#anteBet").prop("disabled", true);
			$("#pairPlusBet").prop("disabled", true);

			$(".outcome").html('<p>Reload the Game to Play Again</p>');
		}
	});

	//Determines the sequence of events after clicking the Fold button
	$(".fold").click(function() {
		$(".dealerHide").hide();

		bankBalance -= anteBetAmt;
		bankBalance -= pairPlusAmt;

		renderBankRoll();

		if (dealerHandValue > playerHandValue && rankedDealerHand[2].rank > rankedPlayerHand[2].rank && rankedDealerHand[1].rank > rankedPlayerHand[1].rank && rankedDealerHand[0].rank > rankedPlayerHand[0].rank) {
			$(".outcome").html('<img src="img/outcomeGoodFold.png" alt="Good Fold">');
		}

		$(this).prop("disabled", true);

		$(".deal").prop("disabled", false);

		$(".play").prop("disabled", true);

		$("#anteBet").prop("disabled", false);

		$("#pairPlusBet").prop("disabled", false);
	});

});