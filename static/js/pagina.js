//////// FUNÇÕES DE CADA BOTÃO DO MENU

document.getElementById('limpar').onclick = function(){
	document.getElementById('content').innerHTML = '';
	lista = document.getElementsByClassName('ativa');
	if(lista.length > 0){
		lista[0].classList.toggle('normal');
		lista[0].classList.toggle('ativa');
	}
}


document.getElementById('uso_mem').onclick = function(){
	var req = new XMLHttpRequest();

	req.onloadend = function(){
		resp = req.responseText;
		document.getElementById('content').innerHTML = resp;
		document.getElementById('uso_mem').classList.toggle("normal");
		document.getElementById('uso_mem').classList.toggle("ativa");

		cria_grafico();
	};

	req.open('GET', 'http://127.0.0.1:5000/uso_memoria.html');
	req.send(null);

	lista = document.getElementsByClassName('ativa');
	if(lista.length > 0){
		lista[0].classList.toggle('normal');
		lista[0].classList.toggle('ativa');
	}
}


document.getElementById('uso_cpu').onclick = function(){
	var req = new XMLHttpRequest();

	req.onloadend = function(){
		resp = req.responseText;
		document.getElementById('content').innerHTML = resp;
		document.getElementById('uso_cpu').classList.toggle("normal");
		document.getElementById('uso_cpu').classList.toggle("ativa");

		cpu();
	};

	req.open('GET', 'http://127.0.0.1:5000/cpu.html');
	req.send(null);

	lista = document.getElementsByClassName('ativa');
	if(lista.length > 0){
		lista[0].classList.toggle('normal');
		lista[0].classList.toggle('ativa');
	}
}


document.getElementById('total_mem').onclick = function(){
	var req1 = new XMLHttpRequest();

	req1.onloadend = function(){
		resp1 = req1.responseText;
		document.getElementById('content').innerHTML = resp1;
		document.getElementById('total_mem').classList.toggle("normal");
		document.getElementById('total_mem').classList.toggle("ativa");

		cria_grafico();
	};

	req1.open('GET', 'http://127.0.0.1:5000/total_memoria.html');
	req1.send(null);	

	var req2 = new XMLHttpRequest();
	req2.onloadend = function(){
		resp2 = req2.responseText;
		resp_json = JSON.parse(resp2);
		document.getElementById('total_mem_b').textContent = resp_json.total_mem_b + ' Bytes';
		document.getElementById('total_mem_k').textContent = resp_json.total_mem_k + ' KBytes';
		document.getElementById('total_mem_m').textContent = resp_json.total_mem_m + ' MBytes';
		document.getElementById('total_mem_g').textContent = resp_json.total_mem_g + ' GBytes';
	};

	req2.open('GET', 'http://127.0.0.1:5000/total_memoria');
	req2.send(null);	


	lista = document.getElementsByClassName('ativa');
	if(lista.length > 0){
		lista[0].classList.toggle('normal');
		lista[0].classList.toggle('ativa');
	}
}


document.getElementById('num_proc').onclick = function(){
	var req = new XMLHttpRequest();

	req.onloadend = function(){
		resp = req.responseText;
		document.getElementById('content').innerHTML = resp;
		document.getElementById('num_proc').classList.toggle("normal");
		document.getElementById('num_proc').classList.toggle("ativa");

		total_processos()
	};

	req.open('GET', 'http://127.0.0.1:5000/num_processos.html');
	req.send(null);	

	lista = document.getElementsByClassName('ativa');
	if(lista.length > 0){
		lista[0].classList.toggle('normal');
		lista[0].classList.toggle('ativa');
	}

}

document.getElementById('user_log').onclick = function(){
	var req = new XMLHttpRequest();

	req.onloadend = function(){
		resp = req.responseText;
		document.getElementById('content').innerHTML = resp;
		document.getElementById('user_log').classList.toggle("normal");
		document.getElementById('user_log').classList.toggle("ativa");

		qtd_logados()
	};

	req.open('GET', 'http://127.0.0.1:5000/usr_logados.html');
	req.send(null);	

	lista = document.getElementsByClassName('ativa');
	if(lista.length > 0){
		lista[0].classList.toggle('normal');
		lista[0].classList.toggle('ativa');
	}

}

document.getElementById('t_logada').onclick = function(){
	var req = new XMLHttpRequest();

	req.onloadend = function(){
		resp = req.responseText;
		document.getElementById('content').innerHTML = resp;
		document.getElementById('t_logada').classList.toggle("normal");
		document.getElementById('t_logada').classList.toggle("ativa");
		temp_ligada()
	};

	req.open('GET', 'http://127.0.0.1:5000/tmp_ligada.html');
	req.send(null);	

	lista = document.getElementsByClassName('ativa');
	if(lista.length > 0){
		lista[0].classList.toggle('normal');
		lista[0].classList.toggle('ativa');
	}

}
