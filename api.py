# coding: utf-8

from flask import Flask

import psutil
import json
import os


app = Flask(__name__)


##########################            arquivos de JavaScript            ##########################


@app.route('/static/js/funcoes.js', methods={'GET'})
def graficos_memoria_js():
	'''
		Retorna o JavaScript reponsável pelas funções de atualização automática via AJAX
	'''
	return open('static/js/funcoes.js', 'r').read()


@app.route('/static/js/d3.v3.min.js', methods={'GET'})
def d3_min_js():
	'''
		Retorna o conteudo do arquivo responsável pela criação dos gráficos.
	'''
	return open('static/js/d3.v3.min.js', 'r').read()


@app.route('/static/js/pagina.js', methods={'GET'})
def pagina_js():
	'''
		Retorna o JavaScript responsável pelo ajax da página inicial
	'''
	return open('static/js/pagina.js', 'r').read()


@app.route('/static/js/total_processos.js', methods={'GET'})
def total_processos_js():
	'''
		Retorna o JavaScript responsável pelo ajax do total de processos
	'''
	return open('static/js/total_processos.js', 'r').read()


##################################            arquivos de CSS            ##################################


@app.route('/static/css/style.css', methods={'GET'})
def css():
	'''
		Retorna a folha de estilo da página
	'''
	return open('static/css/style.css', 'r').read()


#######################           arquivos de configuração dos gráficos             #######################


@app.route('/data.csv', methods={'GET'})
def data_csv_arq():
	'''
		Retorna o conteudo do arquivo de configuração do gráfico de pizza do uso de memoria
	'''
	return open('configs/data.csv', 'r').read()


@app.route('/cpu_pizza.csv', methods={'GET'})
def cpu_pizza_csv_arq():
	'''
		Retorna o conteudo do arquivo de configuração do gráfico de pizza do uso de cpu
	'''
	return open('configs/cpu_pizza.csv', 'r').read()


############################             arquivos de paginas HTML             ############################


@app.route('/', methods={'GET'})
def index():
	'''
		Retorna o conteudo da página inicial
	'''
	return open('index.html', 'r').read()


@app.route('/cpu.html', methods={'GET'})
def cpu_arq():
	'''
		Retorna o conteudo da página de uso de cpu
	'''
	open('configs/cpu_linha.csv', 'w').write('')
	return open('uso_cpu.html', 'r').read()


@app.route('/total_memoria.html', methods={'GET'})
def total_mem_arq():
	'''
		Retorna o conteudo da página de total de memória
	'''
	return open('total_memoria.html', 'r').read()


@app.route('/uso_memoria.html', methods={'GET'})
def uso_mem_arq():
	'''
		Retorna o conteudo da página de uso de memória
	'''
	# apagar o arquivo do grafico de linha
	open('configs/grafico_linha.csv', 'w').write('')
	return open('uso_memoria.html', 'r').read()


@app.route('/num_processos.html', methods={'GET'})
def num_processos_arq():
	'''
		Retorna o conteudo da página de numero de processos
	'''
	return open('num_processos.html', 'r').read()


@app.route('/usr_logados.html', methods={'GET'})
def usr_logados_arq():
	'''
		Retorna o conteudo da página de numero de processos
	'''
	return open('usr_logados.html', 'r').read()


@app.route('/tmp_ligada.html', methods={'GET'})
def tmp_ligada_arq():
	'''
		Retorna o conteudo da página de numero de processos
	'''
	return open('tmp_ligada.html', 'r').read()


################################         funções da api         ################################


@app.route('/uso_cpu', methods={'GET'})
def uso_cpu():
	'''
		calcula o uso da cpu ate o momento e atualiza os arquivos de configuração
	'''
	# cria o arquivo no formato pedido pelo grafico de pizza d3
	a = open('configs/cpu_pizza.csv', 'w')
	a.write(('percentual,valor\n'))

	# obtem o valor da memoria usada
	cpu = psutil.cpu_percent()
	a.write(('%.2f,%d\n' % (100 - cpu, 100 - cpu)))
	a.write(('%.2f,%d\n' % (cpu, cpu)))
	a.close()


	# atualiza o arquivo para poder quebrar nos dicts
	t = open('configs/cpu_linha.csv', 'r').read()
	l = []
	lf = []

	# verifica se ja existia algo no arquivo do grafico de linha
	print len(t)
	if len(t) != 0:
		# arruma o conteudo do arquio para ficar quebravel
		o = open('configs/cpu_linha.csv', 'w')
		o.write(t.replace('}, {', '};{'))
		o.close()

		t = open('configs/cpu_linha.csv', 'r').read()
		dicts = t[1:len(t)-1].split(';')

		# percorre dicts adicionando os dict na lista l
		for d in dicts:
			l.append(json.loads(d, encoding='utf-8'))

		# retira o mais antigo
		if len(l) == 61:
			l.pop(0)

		# percorre a lista atualizando os segundos
		for i in l:
			i['x'] += 1
			lf.append(i)

	# adiciona o mais novo dado da memoria
	lf.append({"x": 0, "y": cpu})

	# grava os novos dados no arquivo do grafico de linha
	o = open('configs/cpu_linha.csv', 'w')
	o.write(json.dumps(lf))
	o.close()

	return json.dumps({'valores': lf})


@app.route('/total_memoria', methods={'GET'})
def total_memoria():
	'''
		Retorna a quantidade total de memoria contida no host.
	'''
	return json.dumps({
			"total_mem_b": '%.3f' % (psutil.virtual_memory()[0]),
			"total_mem_k": '%.3f' % (psutil.virtual_memory()[0] / 1024.),
			"total_mem_m": '%.3f' % (psutil.virtual_memory()[0] / 1048576.),
			"total_mem_g": '%.3f' % (psutil.virtual_memory()[0] / 1073741824.)
		})


@app.route('/memoria_usada', methods={'GET'})
def memoria_usada():
	'''
		calcula a quantidade de memoria usada atualmente e atualiza o conteudo do arquivo de configuração dos gráficos (data.csv) e retorna um json com os dados do gráfico de linha
	'''
	# cria o arquivo no formato pedido pelo grafico de pizza d3
	a = open('configs/data.csv', 'w')
	a.write(('percentual,valor\n'))

	# obtem o valor da memoria usada
	memoria = psutil.virtual_memory()
	mem = memoria[0] - memoria[1]
	percen = memoria[2]
	a.write(('%.2f,%d\n' % (percen, mem)))
	a.write(('%.2f,%d\n' % (100 - percen, memoria[1])))
	a.close()


	# atualiza o arquivo para poder quebrar nos dicts
	t = open('configs/grafico_linha.csv', 'r').read()
	l = []
	lf = []

	# verifica se ja existia algo no arquivo do grafico de linha
	if len(t) != 0:
		# arruma o conteudo do arquio para ficar quebravel
		o = open('configs/grafico_linha.csv', 'w')
		o.write(t.replace('}, {', '};{'))
		o.close()

		t = open('configs/grafico_linha.csv', 'r').read()
		dicts = t[1:len(t)-1].split(';')

		# percorre dicts adicionando os dict na lista l
		for d in dicts:
			l.append(json.loads(d, encoding='utf-8'))

		# retira o mais antigo
		if len(l) == 61:
			l.pop(0)

		# percorre a lista atualizando os segundos
		for i in l:
			i['x'] += 1
			lf.append(i)

	# adiciona o mais novo dado da memoria
	lf.append({"x": 0, "y": percen})

	# grava os novos dados no arquivo do grafico de linha
	o = open('configs/grafico_linha.csv', 'w')
	o.write(json.dumps(lf))
	o.close()

	return json.dumps({'valores': l})


@app.route('/qtde_processos', methods={'GET'})
def qtde_processos():
	'''
		Retorna a quantidade total de processos em execução no momento
	'''
	return json.dumps({"qtde_processos": len(set(psutil.get_process_list()))})


@app.route('/qtde_logados', methods={'GET'})
def qtde_logados():
	'''
		Retorna a quantidade de usuarios logados no sistema ate o momento.
	'''
	return json.dumps({"qtde_logados": len((set([u[0] for u in psutil.get_users()])))})

@app.route('/temp_ligada', methods={'GET'})
def tmp_ligada():
	'''
		Retorna a quantidade de usuarios logados no sistema ate o momento.
	'''
	return json.dumps({"qtde_ligada": os.popen("uptime").read().split()[2].replace(',','')})


if __name__ == '__main__':
	app.run(debug=True)