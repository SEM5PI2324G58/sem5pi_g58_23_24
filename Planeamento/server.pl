% Import de Bibliotecas HTTP
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_unix_daemon)).
:- use_module(library(http/http_parameters)).
:- use_module(library(http/http_open)).
:- use_module(library(http/http_cors)).
:- use_module(library(date)).
:- use_module(library(random)).

% Import de Bibliotecas JSON
:- use_module(library(http/json_convert)).
:- use_module(library(http/http_json)).
:- use_module(library(http/json)).

% Import do nosso módulo 
:- use_module(base).

% Iniciar o servidor
iniciar_servidor :-
    http_server(http_dispatch, [port(5000)]).

% Definição do caminho para o ficheiro JSON
:- http_handler('/edificio/getInformacaoPlaneamento', obterDados, []).

dados_mapa("http://localhost:4200/edificio/getInformacaoPlaneamento").

% Predicado que vai buscar os dados ao ficheiro JSON
obterDados(Request) :-
    dados_mapa(URL),
    setup_call_cleanup(
        http_open(URL, In, [request_header('Accept'='application/json')]),
        json_read_dict(In, Data),
        close(In)
    ),
    processarDados(Data).

% Predicado que processa os dados obtidos do ficheiro JSON

processarDados(Data) :-
    % Iterar sobre cada elemento do array Data.pisos
    maplist(assertStringAsFact, Data.pisos),
    maplist(assertStringAsFact, Data.elevadores),
    maplist(assertStringAsFact, Data.coordElevadores),
    maplist(assertStringAsFact, Data.corredores),
    maplist(assertStringAsFact, Data.coordCorredores),
    maplist(assertStringAsFact, Data.salas),
    maplist(assertStringAsFact, Data.coordPortas),
    
assertStringAsFact(StringFact) :-
    % Converter a string para um termo Prolog
    term_string(Termo, StringFact),
    % Adicionar o termo à base de conhecimento
    base:assertz(Termo).

resetBaseKnowledge :-
    base:retractall(pisos(_)),
    base:retractall(elevadores(_)),
    base:retractall(coordElevadores(_)),
    base:retractall(corredores(_)),
    base:retractall(coordCorredores(_)),
    base:retractall(salas(_)),
    base:retractall(coordPortas(_)).