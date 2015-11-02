var five = require("johnny-five");
var ShiftSeven = require("shift-seven");
var SimpleGame = require("simple-game");

var board = new five.Board();

board.on("ready", function() {
	var players = [
		new SimpleGame.Player({
			scoreboard: new ShiftSeven({
				pins: {
					data: 2,
					clock: 3,
					latch: 4
				}
			}),
			addPoint: new five.Button(13),
			removePoint: new five.Button(12)
		}),

		new SimpleGame.Player({
			scoreboard: new ShiftSeven({
				pins: {
					data: 8,
					clock: 9,
					latch: 10
				}
			}),
			addPoint: new five.Button(7),
			removePoint: new five.Button(6)
		})
	];

	var game = new SimpleGame.Game({
		maxPoints: 7
	});

	players.forEach(function(player) {
		var scoreboard = player.options.scoreboard;

		scoreboard.draw(0);

		player.on("score", function(score) {
			scoreboard.draw(score);
		});

		player.on("reset", function() {
			scoreboard.draw(0);
		});

		["addPoint", "removePoint"].forEach(function(action) {
			player.getOption(action).on("down", function() {
				player[action]();
			});
		});

		game.addPlayer(player);
	});

	game.on("end", function(players) {
		var scoreboard = players[0].options.scoreboard;
		var flashes = 10;
		var duration = 200;

		setTimeout(function toggle() {
			if (flashes % 2) {
				scoreboard.draw(players[0].getScore());
			} else {
				scoreboard.off();
			}

			if (--flashes) {
				setTimeout(toggle, duration);
			}
		}, duration);
	});
});
