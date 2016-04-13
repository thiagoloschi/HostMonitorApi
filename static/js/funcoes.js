function cria_grafico(){
	if(document.getElementById('uso_mem').classList.contains('ativa')){
		// requisita a atualização do grafico
		var req = new XMLHttpRequest();

		req.onloadend = function(){
			resp = req.responseText;
			resp_json = JSON.parse(resp);
			valores = resp_json.valores;

			// escala do grafico
			var width = 240,
			    height = 240,
			    radius = Math.min(width, height) / 2;

			// cor dos pedaços do grafico
			var color = d3.scale.ordinal()
			    .range(["#f75", "#57f"]);

			var arc = d3.svg.arc()
			    .outerRadius(radius - 10)
			    .innerRadius(0);

			var pie = d3.layout.pie()
			    .sort(null)
			    .value(function(d) { return d.valor; });

			// Remove o gráfico já existente e insere um atualizado no lugar
			d3.select("svg").remove();
			var svg = d3.select("#grafico_pizza").append("svg")
			    .attr("width", width)
			    .attr("height", height)
			    .append("g")
			    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			d3.csv("data.csv", function(error, data) {
			  data.forEach(function(d) {
			    d.valor = +d.valor;
			  });

			  var g = svg.selectAll(".arc")
			      .data(pie(data))
			    .enter().append("g")
			      .attr("class", "arc");

			  g.append("path")
			      .attr("d", arc)
			      .style("fill", function(d) { return color(d.data.percentual); });

			  g.append("text")
			      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
			      .attr("dy", ".35em")
			      .style("text-anchor", "middle")
			      .text(function(d) { return d.data.percentual; });
			});


			//////////////////////////////////// GRAFICO DE LINHA ////////////////////////////////////


			// coordenadas das linhas
			var lineData = valores;

			// remove o svg atual para inserir o atualizado
			d3.select("#visualization").remove();
			var vis = d3.select("#grafico_linha").append("svg")
				.attr('id', 'visualization')
				.attr('width', '600px')
				.attr('height', '300px'), 
			    WIDTH = 600,
			    HEIGHT = 300,
			    MARGINS = {
			      top: 20,
			      right: 20,
			      bottom: 20,
			      left: 50
			    },
			    xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(lineData, function(d) {
			      return 60;
			    }), d3.max(lineData, function(d) {
			      return 0;
			    })]),
			    yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(lineData, function(d) {
			      return 0;
			    }), d3.max(lineData, function(d) {
			      return 100;
			    })]),
			    xAxis = d3.svg.axis()
			      .scale(xRange)
			      .tickSize(5)
			      .tickSubdivide(true),
			    yAxis = d3.svg.axis()
			      .scale(yRange)
			      .tickSize(5)
			      .orient('left')
			      .tickSubdivide(true);

			// cria os eixos x e y desenhando com svg
			vis.append('svg:g')
			  	.attr('class', 'x axis')
			  	.attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
			  	.call(xAxis);
			 
			vis.append('svg:g')
			  	.attr('class', 'y axis')
			  	.attr('transform', 'translate(' + (MARGINS.left) + ',0)')
			  	.call(yAxis);

			// linha de valor do grafico
			var lineFunc = d3.svg.line()
					  .x(function(d) {
					    return xRange(d.x);
					  })
					  .y(function(d) {
					    return yRange(d.y);
					  })
					  .interpolate('linear');

			vis.append('svg:path')
				  	.attr('d', lineFunc(lineData))
				  	.attr('stroke', '#f57')
				  	.attr('stroke-width', 2)
				  	.attr('fill', 'none');
		};

		req.open('GET', 'http://127.0.0.1:5000/memoria_usada');
		req.send(null);


		setTimeout(cria_grafico, 1000);
	}
}

function total_processos(){
	if(document.getElementById('num_proc').classList.contains('ativa')){
		var req = new XMLHttpRequest();
		req.onloadend = function(){
			resp = req.responseText;
			resp_json = JSON.parse(resp);
			document.getElementById('qtde_processos').textContent = resp_json.qtde_processos;
		};

		req.open('GET', 'http://127.0.0.1:5000/qtde_processos');
		req.send(null);

		setTimeout(total_processos, 1000);
	}
}

function qtd_logados(){
	if(document.getElementById('user_log').classList.contains('ativa')){
		var req = new XMLHttpRequest();
		req.onloadend = function(){
			resp = req.responseText;
			resp_json = JSON.parse(resp);
			document.getElementById('qtde_logados').textContent = resp_json.qtde_logados;
		};

		req.open('GET', 'http://127.0.0.1:5000/qtde_logados');
		req.send(null);

		setTimeout(qtd_logados, 1000);
	}
}

function temp_ligada(){
	if(document.getElementById('t_logada').classList.contains('ativa')){
		var req = new XMLHttpRequest();
		req.onloadend = function(){
			resp = req.responseText;
			resp_json = JSON.parse(resp);
			document.getElementById('qtde_ligada').textContent = (resp_json.qtde_ligada + (resp_json.qtde_ligada.length > 2 ? ' horas' : ' minuto' + (resp_json.qtde_ligada == '1' ? '' : 's')));
		};
		
		req.open('GET', 'http://127.0.0.1:5000/temp_ligada');
		req.send(null);

		setTimeout(temp_ligada, 1000);
	}
}

function cpu(){
	if(document.getElementById('uso_cpu').classList.contains('ativa')){
		// requisita a atualização do grafico
		var req = new XMLHttpRequest();

		req.onloadend = function(){
			resp = req.responseText;
			resp_json = JSON.parse(resp);
			valores = resp_json.valores;

			// escala do grafico
			var width = 240,
			    height = 240,
			    radius = Math.min(width, height) / 2;

			// cor dos pedaços do grafico
			var color = d3.scale.ordinal()
			    .range(["#57f", "#f75"]);

			var arc = d3.svg.arc()
			    .outerRadius(radius - 10)
			    .innerRadius(0);

			var pie = d3.layout.pie()
			    .sort(null)
			    .value(function(d) { return d.valor; });

			// Remove o gráfico já existente e insere um atualizado no lugar
			d3.select("svg").remove();
			var svg = d3.select("#grafico_pizza").append("svg")
			    .attr("width", width)
			    .attr("height", height)
			    .append("g")
			    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			d3.csv("cpu_pizza.csv", function(error, data) {

			  data.forEach(function(d) {
			    d.valor = +d.valor;
			  });

			  var g = svg.selectAll(".arc")
			      .data(pie(data))
			    .enter().append("g")
			      .attr("class", "arc");

			  g.append("path")
			      .attr("d", arc)
			      .style("fill", function(d) { return color(d.data.percentual); });

			  g.append("text")
			      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
			      .attr("dy", ".35em")
			      .style("text-anchor", "middle")
			      .text(function(d) { return d.data.percentual; });

			});


			//////////////////////////////////// GRAFICO DE LINHA ////////////////////////////////////


			// coordenadas das linhas
			var lineData = valores;

			// remove o svg atual para inserir o atualizado
			d3.select("#visualization").remove();
			var vis = d3.select("#grafico_linha").append("svg")
				.attr('id', 'visualization')
				.attr('width', '600px')
				.attr('height', '300px'), 
			    WIDTH = 600,
			    HEIGHT = 300,
			    MARGINS = {
			      top: 20,
			      right: 20,
			      bottom: 20,
			      left: 50
			    },
			    xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(lineData, function(d) {
			      return 60;
			    }), d3.max(lineData, function(d) {
			      return 0;
			    })]),
			    yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(lineData, function(d) {
			      return 0;
			    }), d3.max(lineData, function(d) {
			      return 100;
			    })]),
			    xAxis = d3.svg.axis()
			      .scale(xRange)
			      .tickSize(5)
			      .tickSubdivide(true),
			    yAxis = d3.svg.axis()
			      .scale(yRange)
			      .tickSize(5)
			      .orient('left')
			      .tickSubdivide(true);

			// cria os eixos x e y desenhando com svg
			vis.append('svg:g')
			  	.attr('class', 'x axis')
			  	.attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
			  	.call(xAxis);
			 
			vis.append('svg:g')
			  	.attr('class', 'y axis')
			  	.attr('transform', 'translate(' + (MARGINS.left) + ',0)')
			  	.call(yAxis);

			// linha de valor do grafico
			var lineFunc = d3.svg.line()
					  .x(function(d) {
					    return xRange(d.x);
					  })
					  .y(function(d) {
					    return yRange(d.y);
					  })
					  .interpolate('linear');

			vis.append('svg:path')
				  	.attr('d', lineFunc(lineData))
				  	.attr('stroke', '#f57')
				  	.attr('stroke-width', 2)
				  	.attr('fill', 'none');
		};

		req.open('GET', 'http://127.0.0.1:5000/uso_cpu');
		req.send(null);


		setTimeout(cpu, 1000);
	}
}