<!--

document.oncontextmenu = function () { return false; }
document.ondragstart = function () { return false; }

var dim = 50, esp = 0, bord = 3, margeContours; //Voir init() pour changer
var nb = 0, undoPList = new Array(), marge;
var dragged = new Array(null, 0, 0);

function posDansEcranX(x) {
	if (x > inW-margeContours) x = inW-margeContours;
	if (x < margeContours-dim) x = margeContours-dim;
	
	return x;
}

function posDansEcranY(y) {
	if (y > inH-margeContours) y = inH-margeContours;
	if (y < margeContours-dim) y = margeContours-dim;

	return y;
}

function posDansEcran(position) {
	return [posDansEcranX(position[0]), posDansEcranY(position[1])];
}

function actualiserPos() {
	var allDivs = document.getElementsByClassName("colorContainer");
	for (var i = 0; i < allDivs.length; i++) {
		allDivs[i].style.left = posDansEcranX(allDivs[i].style.left.split("p")[0]) + "px";
		allDivs[i].style.top = posDansEcranY(allDivs[i].style.top.split("p")[0]) + "px";
	}
}

function creerDiv(color, position) {
	nb++;
	position = posDansEcran(position);
	x = position[0];
	y = position[1];

	var id = document.createAttribute("id");
		id.nodeValue = "c"+nb;
	var name = document.createAttribute("name");
		name.nodeValue = "c"+nb;
	var cl = document.createAttribute("class");
		cl.nodeValue = "colorContainer";
	var mouseD = document.createAttribute("onmousedown");
		mouseD.nodeValue = "drag(this, event);";
	var mouseU = document.createAttribute("onmouseup");
		mouseU.nodeValue = "drop(this, event);";
	var dblC = document.createAttribute("ondblclick");
		dblC.nodeValue = "alert(this.style.backgroundColor.replace('rgb', 'rgba').replace(')', ', '+this.style.opacity+')'));";
	var style = document.createAttribute("style");
		style.nodeValue = "height:"+(dim-2*bord)+"px; width:"+(dim-2*bord)+"px; background-color:rgb("+color[0]+","+color[1]+","+color[2]+"); border:"+bord+"px solid black; border-radius:"+(dim/2)+"px; left:"+x+"px; top:"+y+"px; z-index:"+nb+"; opacity:"+color[3]+"; filter:alpha(opacity="+(100*color[3])+"); ";
	var newDiv = document.createElement("div");
		newDiv.setAttributeNode(id);
		newDiv.setAttributeNode(name);
		newDiv.setAttributeNode(cl);
		newDiv.setAttributeNode(mouseD);
		newDiv.setAttributeNode(mouseU);
		newDiv.setAttributeNode(dblC);
		newDiv.setAttributeNode(style);
	document.getElementsByTagName("body")[0].appendChild(newDiv);
}

function decomposeColor(style) {
	var rgba = style.backgroundColor;
	while (rgba.indexOf(" ") != -1)
		rgba = rgba.replace(" ","");
	rgba = rgba.substring(4, rgba.length-1);
	rgba = rgba.split(",");
	rgba[3] = style.opacity;
	if (rgba[3] == undefined) rgba[3] = style.filters.alpha.opacity/100;
	return rgba;
	// HEXA pour opera!!!!!! ?
}

function calcColor(color1, color2) {
	var color = new Array();
	for (var i = 0; i < 3; i++)
		//color[i] = Math.floor((color1[i]- -color2[i])/2);
		color[i] = color1[i]- -color2[i];
	// ajouter case de départ pour baisser luminosité
	var max = Math.max(color[0], color[1], color[2]);
	if (max > 255) {
		var rapport = max/255;
		for (var i = 0; i < 3; i++)
			color[i] = Math.floor(color[i]/rapport);
	}
	color[3] = (color1[3]- -color2[3])/2;
	return color;
}

function dansPoubelle(position) {
	var p = document.getElementById('poubelle');
	return ((position[0] >= inW - p.style.width.split("p")[0]) && (position[1] >= inH - p.style.height.split("p")[0] + 20));
}

function changerPoubelle(event) {
	var p = document.getElementById('poubelle');
	if (dansPoubelle([event.clientX, event.clientY]))
		p.style.backgroundImage = 'url(po.png)';
	else
		p.style.backgroundImage = 'url(pf.png)';
}

function undoPoubelle() {
	if (undoPList.length > 0) {
		document.getElementById(undoPList[undoPList.length-1]).style.display = "";
		undoPList.length -= 1;
	}
}

function mettrePoubelle(obj) {
	obj.style.display = "none";
	undoPList[undoPList.length] = obj.id;
}

function collision(obj) {
	var div = null;
	
	if (obj != null) {
		var z = -1;
		var left = obj.style.left.split("p")[0], top = obj.style.top.split("p")[0];
		var allDivs = document.getElementsByClassName("colorContainer");
		for (var i = 0; i < allDivs.length; i++) {
			var left2 = allDivs[i].style.left.split("p")[0];
			var top2 = allDivs[i].style.top.split("p")[0];
			/*(left > left2-marge) && (left < left2-(-marge)) && (top > top2-marge) && (top < top2-(-marge))*/
			if ((Math.pow(left2-left,2)+Math.pow(top2-top,2) <= Math.pow(marge,2)) && (allDivs[i].id != obj.id) && (allDivs[i].style.display == "")) {
				if (allDivs[i].style.zIndex >= z) {
					div = allDivs[i];
					z = div.style.zIndex;
				}
			}
		}
	}
	
	return div;
}

function drag(obj, event) {
	nb++;
	obj.style.zIndex = nb;
	dragged[0] = obj.id;
	dragged[1] = event.clientX - obj.style.left.split("p")[0];
	dragged[2] = event.clientY - obj.style.top.split("p")[0];
}

function move(event) {
	if (dragged[0] != null) {
		var obj = document.getElementById(dragged[0]);
		var position = posDansEcran(new Array(event.clientX-dragged[1], event.clientY-dragged[2]));
		obj.style.left = position[0] + "px";
		obj.style.top = position[1] + "px";
		obj.focus();
	}
}

function drop(obj, event) {
	dragged[0] = null;
	dragged[1] = 0;
	dragged[2] = 0;
	var obj2 = collision(obj);
	if (dansPoubelle([event.clientX, event.clientY]))
		mettrePoubelle(obj);
	else if (obj2 != null)
		creerDiv(calcColor(decomposeColor(obj.style), decomposeColor(obj2.style)), [(obj.style.left.split("p")[0]- -obj2.style.left.split("p")[0])/2, (obj.style.top.split("p")[0]- -obj2.style.top.split("p")[0])/2]);
}

function init(arrayC, dim2, esp2, bord2, margeContours2) {
	actualiserDims();
	
	if (dim2)
		dim = dim2;
	if (esp2)
		esp = esp2;
	if (bord2)
		bord = bord2;
	if (margeContours2)
		margeContours = margeContours2;
	else
		margeContours = dim;
	marge = dim/3;
	var len = arrayC.length;
	var position = new Array(0, (inH-dim)/2);
	for (var i = 0; i < len; i++) {
		position[0] = inW/2 + (i-len/2)*(dim+esp) + esp/2;
		dec = arrayC[i].split(",");
		for (var j = 0; j < 4; j++)
			if (dec[j] == undefined) dec[j] = 1;
		creerDiv(dec, position);
	}
}

//-->