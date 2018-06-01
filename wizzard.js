var object = null;
var level = null;
var tree = [];
var config = {};

function close() {
	$('#overlay').remove();
}

function animate() {
	var sel_num = $('#overlay fieldset input:checked').val();
	$('#overlay fieldset input').each(function(i, e) {
		$(e).removeClass('level1');
		$(e).removeClass('level2');
		$(e).removeClass('level4');
		$(e).removeClass('level5');
		$(e).removeClass('hidden');
		$(e).removeClass('hidden-bottom');
		$(e).removeClass('hidden-top');
		$(e).removeClass('selected');
		if(Math.abs(sel_num - $(e).val()) == 0)
			$(e).addClass('selected');
		else if(sel_num - $(e).val() > 2)
			$(e).addClass('hidden-top').addClass('hidden');
		else if(sel_num - $(e).val() == 2)
			$(e).addClass('level1');
		else if(sel_num - $(e).val() == 1)
			$(e).addClass('level2');
		else if(sel_num - $(e).val() == -1)
			$(e).addClass('level4');
		else if(sel_num - $(e).val() == -2)
			$(e).addClass('level5');
		else if(sel_num - $(e).val() < -2)
			$(e).addClass('hidden-bottom').addClass('hidden');
	});
	if(config['scrollbar'])
		scrollbar();
}

function back() {
	if(tree.length <= 0)
		return;
	tree.pop();
	startWithHash();
}

function startWithHash() {
	level = object;
	$(tree).each(function(i, e) {
		level = level[e].content;
	});
	fill_items();
}

function item_selected() {
	var num = $('#overlay input:checked').val();
	if(typeof level[num].content == "object") {
		level = level[num].content;
		tree.push(num);
		fill_items();
	} else if(typeof level[num].content == "string") {
		window.location = level[num].content;
	}
}

function scrollbar() {
	var active_num = $('#overlay input:checked').val()
	var item_count = $('#overlay input').length;
	var height = parseInt($('#overlay #scrollbar').css('height').replace("px", ""));
	$('#overlay #scrollbar #scroller').css('top', height * active_num / item_count + "px");	
	$('#overlay #scrollbar #scroller').css('height', height / item_count + "px");	
}

function fill_items() {
	window.location.hash = tree.join(",");
	$('#overlay').empty();

	var sel_num = 0;
	$('#overlay').append('<div></div>');
	if(config['heading'])
		$('#overlay > div').append('<h1>' + config['heading'] + '</h1>');
	if(config['description'])
		$('#overlay > div').append('<p>' + config['description'] + '</p>');
	if(config['buttons'] && config['buttons']['back'] && config['buttons']['back'] == true) {
		if(tree.length > 0)
			$('#overlay > div').append('<button onClick="javascript: back()">Back</button>');
		else
			$('#overlay > div').append('<button disabled="true">Back</button>');
	}
	if(config['buttons'] && config['buttons']['close'] && config['buttons']['close'] == true)
		$('#overlay').append('<a href="javascript: close()" id="close">x</a>');
	if(config['buttons'] && config['buttons']['select'] && config['buttons']['select'] == true)
		$('#overlay > div').append('<button onClick="javascript: item_selected()">Select</button>');
	$('#overlay > div').append('<fieldset></fieldset>');
	if(config['scrollbar'])
	{
		$('#overlay fieldset').append('<div id="scrollbar"><div id="scroller"></div></div>');
		if(config['scrollbar']['width'])
			$('#overlay #scrollbar').css('width', config['scrollbar']['width'] + 'px');
	}
	$(level).each(function(i, e) {
		$('#overlay fieldset').append('<div class="item"><input type="radio" ' + (sel_num == i ? 'checked="checked"' : "") + ' value="' + i + '" name="items" id="item_' + i+ '" /><label for="item_' + i + '"><span>' + e.title + '</span></label></div>');
	});
	$('#overlay fieldset input').change(function() {animate();});
	animate();
	$('#overlay fieldset input:checked')[0].focus();
}

function _wizzard() {
	$('body').prepend('<div id="overlay"></div>');
	$(document).click(function(e) {
		$('#overlay fieldset input:checked')[0].focus();
	});
	$(document).keydown(function(e){
		if (e.which == 13 || e.which == 39){
			e.preventDefault();
			item_selected();
		}
		if (e.which == 8 || e.which == 37){
			e.preventDefault();
			back();
		}
		if (e.which == 40 && $('#overlay input:checked')[0] == $('#overlay input')[$('#overlay input').length - 1]) {
			e.preventDefault();
		}
		if (e.which == 38 && $('#overlay input:checked')[0] == $('#overlay input')[0]) {
			e.preventDefault();
	}
	});
	tree = window.location.hash.substr(1).split(",");
	if(tree[0] == "")
		tree = [];
	for(i = 0; i < tree.length; ++i) {
		tree[i] = parseInt(tree[i]);
		if( isNaN(tree[i]) ) {
			tree = [];
			break;
		}
	}
	startWithHash();
	fill_items();
	if(config['colors'] && config['colors']['bg'])
		$('#overlay').css('background-color', config['colors']['bg']);
}

var wizzard = function(obj, conf = {}){
	object = obj;
	level = obj;
	config = conf;
    var scriptTag = document.createElement('script');
    scriptTag.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js';
    scriptTag.onload = _wizzard;
    scriptTag.onreadystatechange = _wizzard;

    document.body.prepend(scriptTag);
};
