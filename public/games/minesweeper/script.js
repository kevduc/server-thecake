const NUMCOLOR = ['white', 'blue', 'green', 'red', 'darkblue', 'darkred', 'darkcyan', 'black', 'gray'];
var g;
var l = 18, c = 12;
var nb_mines = 30;
var btn = 0;

$(document).ready(init);

function init() {
	$('#nb_mines').hide();
	$('#nb_mines').blur(function() {
		$('#nb_mines').hide();
		nb_mines = $('#nb_mines').val();
		$('#flags_left').text(nb_mines.toString());
		$('#flags_left').show();
	});
	
	$('#flags_left').click(function(e) {
		e.preventDefault();
		$('#flags_left').hide();
		$('#nb_mines').val(nb_mines);
		$('#nb_mines').show();
		$('#nb_mines').focus();
		$('#nb_mines').select();
	});
	$('#flags_left').text(nb_mines.toString());
	
	// $('#time').hide();
	
	$('#btn').click(function() {
		switch(btn) {
			case 0:
				createGame();
				++btn;
				$('#btn').text('Restart');
				$('#flags_left').off('click');
				$('#time').show();
				break;
			case 1:
				location.reload();
				break;
		}
	});
	$('#btn').text('Start');
}

function createGame() {
	var game_display = {
		set: function(obj, prop, val) {
			obj[prop] = val;
			switch(prop) {
				case 'flags_left':
					$('#flags_left').text(val.toString());
					break;
				case 'time':
					$('#time').text(Math.floor(val/60).toString().padStart(2,'0') + ':' + (val%60).toString().padStart(2,'0'));
					break;
				case 'win':
					if(val)
						$('#btn').text('\\o/');
					else
						$('#btn').text(':\'(');
					break;
				default:
					break;
			}
			return true;
		},
	};
	
	g = new Proxy(new Game(18, 12, nb_mines), game_display);
	g.init();
}


function Cell(pos, el) {
	this.value = 0;
	this.revealed = false;
	this.flagged = false;
	this.isaMine = false;
	this.el = el;
	this.pos = pos;
}

function Game(l, c, nb_mines) {
	var table = $('#grid');
	this.grid = [];
	this.nb_mines = nb_mines;
	this.nb_revealed = 0;
	this.l = l;
	this.c = c;
	this.started = false;
	this.ended = false;
	this.win = false;
	this.timer = -1;
	
	this.revealAll = function() {
		this.end();
		for(var i = 0; i < this.l; ++i)
			for(var j = 0; j < this.c; ++j)
				this.grid[i][j].revealed = true;
	}

	this.startTimer = function() {
		this.timer = setInterval(function(){++this.time;}.bind(this), 1000);
	}
	
	this.stopTimer = function() {
		clearInterval(this.timer);
	}
	
	this.end = function() {
		this.ended = true;
		this.stopTimer();
	}
	
	this.lose = function() {
		this.end();
		for(var i = 0; i < this.l; ++i)
			for(var j = 0; j < this.c; ++j)
				if (this.grid[i][j].isaMine)
					this.grid[i][j].revealed = true;
		this.win = false;
	}

	this.win = function() {
		this.end();
		for(var i = 0; i < this.l; ++i)
			for(var j = 0; j < this.c; ++j)
				if (this.grid[i][j].isaMine)
					if(!this.grid[i][j].flagged)
						this.toggleFlag(this.grid[i][j]);
		this.win = true;
	}

	this.reveal = function(cell) {
		if(cell.flagged) return;
		if(!cell.revealed) {
			if(cell.isaMine)
				this.lose();
			else {
				cell.revealed = true;
				++this.nb_revealed;
				if (this.nb_revealed == (this.l*this.c - this.nb_mines)) {
					this.win();
					return;
				}
				if(cell.value == 0) {
					var tmp_l = cell.pos.l;
					var tmp_c = cell.pos.c;
					for(var dl = -1; dl <= 1; ++dl)
						for(var dc = -1; dc <= 1; ++dc)
							if(tmp_l+dl >= 0 && tmp_l+dl < this.l && tmp_c+dc >= 0 && tmp_c+dc < this.c)
								this.reveal(this.grid[tmp_l+dl][tmp_c+dc]);
				}
			}
		}
	}

	this.toggleFlag = function(cell) {
		if(!cell.revealed) {
			window.navigator.vibrate(15);
			if(!cell.flagged && this.flags_left > 0) {
				--this.flags_left;
				cell.flagged = true;
			} else if(cell.flagged) {
				++this.flags_left;
				cell.flagged = false;
			}
		}
	}
	
	this.onCellClick = function(pos, btn) {
		if(!this.started) {
			this.startTimer();
			this.started = true;
		}
		
		cell = this.grid[pos.l][pos.c];
		switch(btn) {
			case 1:
				this.reveal(cell);
				break;
			case 2:
				this.toggleFlag(cell);
				break;
			default:
				break;
		}
	}

	this.clickHandler = function(e) {
		e.preventDefault();
		if (this.ended) return;
		var btn = e.type == 'click' ? 1 : e.type == 'contextmenu' ? 2 : 0;
		this.onCellClick(e.data, btn);
	}
	
	this.init = function() {
		this.flags_left = this.nb_mines;
		this.time = 0;
	
		var cell_display = {
			set: function(obj, prop, val) {
				obj[prop] = val;
				
				switch(prop) {
					case 'flagged':
						if(obj.flagged)
							obj.el.html('<img class="tile" src="flag.png"></img>');
						else
							obj.el.html('');
						break;
					case 'revealed':
						obj.el.removeClass('unrevealed');
						obj.el.addClass('revealed');
						if(obj.isaMine)
							obj.el.html('<img class="tile" src="mine.png"></img>');
						else if(obj.value == 0)
							obj.el.html('');
						else {
							obj.el.css('color', NUMCOLOR[obj.value]);
							obj.el.html(obj.value);
						}
						break;
					default:
						break;
				}
				
				return true;
			},
		};
		
		for(var i = 0; i < this.l; ++i) {
			var tr = $('<tr></tr>');
			this.grid[i] = [];
			for(var j = 0; j < this.c; ++j) {
				var td = $('<td class="unrevealed"></td>');
				pos = {l:i, c:j};
				td.click(pos, this.clickHandler.bind(this));
				td.contextmenu(pos, this.clickHandler.bind(this));
				tr.append(td);
				this.grid[i][j] = new Proxy(new Cell(pos, td), cell_display);
			}
			table.append(tr);
		}
		
		// Random mines
		var length = this.l*this.c;
		var list = Array.from(Array(length).keys());
		for(var i = 0; i < this.nb_mines; ++i) {
			var reduced_length = length-i;
			var rnd_i = Math.floor(Math.random() * reduced_length);
			var r = list[rnd_i];
			list[rnd_i] = list[reduced_length-1];
			list[reduced_length-1] = r;
			
			var tmp_l = Math.floor(r/this.c);
			var tmp_c = r%this.c;
			this.grid[tmp_l][tmp_c].isaMine = true;
			// inc values
			for(var dl = -1; dl <= 1; ++dl)
				for(var dc = -1; dc <= 1; ++dc)
					if(tmp_l+dl >= 0 && tmp_l+dl < this.l && tmp_c+dc >= 0 && tmp_c+dc < this.c)
						this.grid[tmp_l+dl][tmp_c+dc].value++;
		}
	}
}

