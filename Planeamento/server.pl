% Import de Bibliotecas HTTP
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_client)).
:- use_module(library(http/http_server)).
:- use_module(library(http/http_dispatch)).
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
iniciar_servidor(PORT) :-
    http_server(http_dispatch, [port(PORT)]).

% Manipulador para caminho entre pontos de um piso
:- http_handler('/caminho/pontos_piso', caminho_pontos_piso_handler, []).

caminho_pontos_piso_handler(Request) :-
    http_read_json_dict(Request,Dict,[]),
    ListaPiso = Dict.pisos,
    ListaElev = Dict.elevadores,
    ListaCoordElev = Dict.coordElevadores,
    ListaCorr = Dict.corredores,
    ListaCoordCorr = Dict.coordCorredores,
    ListaSalas = Dict.salas,
    ListaCoordPortas = Dict.coordPortas,
    XOrig = Dict.x_origem,
    YOrig = Dict.y_origem,
    PisoOrig = Dict.piso_origem,
    XDest = Dict.x_destino,
    YDest = Dict.y_destino,
    PisoDest = Dict.piso_destino,
    atom_string(XO,XOrig),
    atom_string(YO,YOrig),
    atom_string(PO,PisoOrig),
    atom_string(XD,XDest),
    atom_string(YD,YDest),
    atom_string(PD,PisoDest),
    obter_dados(ListaPiso, ListaElev, ListaCoordElev, ListaCorr, ListaCoordCorr, ListaSalas, ListaCoordPortas),
    caminho_pontos_piso(XO, YO, PO, XD, YD, PD, LEdCam, LLig),
    with_output_to(atom(LEdCamf),write(LEdCam)),
    with_output_to(atom(LLigf),write(LLig)),
    R = json([edificios=LEdCamf,ligacoes=LLigf]),
    prolog_to_json(R, JSONObject),
    reply_json(JSONObject, [json_object(dict)]).

obter_dados(ListaPiso, ListaElev, ListaCoordElev, ListaCorr, ListaCoordCorr, ListaSalas, ListaCoordPortas) :-
    processar_lista(ListaPiso),
    processar_lista(ListaElev),
    processar_lista(ListaCoordElev),
    processar_lista(ListaCorr),
    processar_lista(ListaCoordCorr),
    processar_lista(ListaSalas),
    processar_lista(ListaCoordPortas).

processar_lista(Lista) :-
    maplist(converter_e_assertar, Lista).

converter_e_assertar(String) :-
    term_string(Termo, String),
    base:assertz(Termo). 
    
% Predicado que reseta a base de conhecimento
resetBaseKnowledge :-
    base:retractall(pisos(_)),
    base:retractall(elevadores(_)),
    base:retractall(coordElevadores(_)),
    base:retractall(corredores(_)),
    base:retractall(coordCorredores(_)),
    base:retractall(salas(_)),
    base:retractall(coordPortas(_)).