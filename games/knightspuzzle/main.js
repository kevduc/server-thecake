var cpt = 0;
var MAX_cpt = 63;
var alpha = 1.5;
var dim = [8, 8];
var tab = new Array();
var c1 = [64, 46, 37];
var c2 = [227, 222, 193];

function lin(cpt) {
  var c_lin = new Array();
  for (var i = 0; i < 3; i++)
    c_lin[i] = Math.floor(c1[i] + (cpt / MAX_cpt) * (c2[i] - c1[i]));
  return c_lin;
}

function change(obj) {
  var pos = obj.id.split(";");

  if (pos[2] == 0 || cpt == 0) {
    if (cpt != 0) {
      possible(tab[cpt - 1], true);
      tab[cpt - 1].className = "choisi";
    }
    obj.className = "dernier";
    c_lin = lin(cpt);
    obj.style.backgroundColor =
      "rgb(" + c_lin[0] + ", " + c_lin[1] + ", " + c_lin[2] + ")";
    tab[cpt] = obj;
    cpt++;
    obj.innerHTML = "<p>" + cpt + "</p>";
    possible(obj, false);
    obj.id = pos[0] + ";" + pos[1] + ";1";
    setTimeout(function() {
      if (cpt > MAX_cpt) alert("Bien joué !");
    }, 500);
  } else if (pos[2] == 1 && obj.innerHTML == "<p>" + cpt + "</p>") {
    obj.style.backgroundColor = "";
    obj.innerHTML = "";
    possible(obj, true);
    obj.id = pos[0] + ";" + pos[1];
    cpt--;
    if (cpt != 0) {
      possible(tab[cpt - 1], false);
      tab[cpt - 1].className = "dernier";
    }
  }
}

function possible(obj, deposs) {
  var pos = obj.id.split(";");
  var classe = deposs ? "" : "possible";
  var ajt_rch = deposs ? ";0" : "";
  var ajt_chg = deposs ? "" : ";0";
  var poss = [
    [2, 1],
    [2, -1],
    [-2, 1],
    [-2, -1],
    [1, 2],
    [-1, 2],
    [1, -2],
    [-1, -2]
  ];

  for (var i = 0; i < poss.length; i++) {
    poss[i] = [pos[0] - poss[i][0], pos[1] - poss[i][1]];
    var id2 = poss[i][0] + ";" + poss[i][1];
    var obj2 = document.getElementById(id2 + ajt_rch);

    if (
      0 <= poss[i][0] &&
      0 <= poss[i][1] &&
      poss[i][0] < 8 &&
      poss[i][1] < 8 &&
      obj2 != null
    ) {
      obj2.className = classe;
      obj2.id = id2 + ajt_chg;
    }
  }
}

function create() {
  var table = document.getElementById("main_table");
  for (var i = 0; i < dim[0]; i++) {
    var tr = document.createElement("tr");
    for (var j = 0; j < dim[1]; j++) {
      var td = document.createElement("td");
      td.setAttribute("id", i + ";" + Math.floor(j));
      td.setAttribute("onClick", "change(this);");
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
}
