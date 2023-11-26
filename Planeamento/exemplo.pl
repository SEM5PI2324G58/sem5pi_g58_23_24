nullPointerException
nullpointerexception5963
Invisível

nullPointerException — 18/10/2023 14:43
A visão da Casa da Música poderá centrar-se em ser um líder em inovação e excelência na apresentação e promoção da música. A instituição pode aspirar a ser um ponto de encontro para músicos, compositores, e amantes da música de todo o mundo, mantendo ao mesmo tempo uma forte ligação com a comunidade local.
Switer101 — 24/10/2023 16:52
david
Switer101 — 26/10/2023 19:32
david
Switer101 — 26/10/2023 23:24
https://www.tiktok.com/@ines.monteiro06/video/7294271658313927969?_r=1&_t=8gqPF2eaqSe
TikTok
TikTok · Nenas
2429 likes, 11 comments. “Sao dias stressantes”
TikTok · Nenas
nullPointerException — 27/10/2023 19:32
literalmente...
só cheguei agora, fds
Switer101 — 27/10/2023 19:32
o projeto foi adiado pra semana
nullPointerException — 27/10/2023 19:32
impossível
Switer101 — 27/10/2023 19:32
mas convem adiantar a msm
nullPointerException — 27/10/2023 19:32
não acredito
nullPointerException — 27/10/2023 21:17
o mock funciona assim 

    
// Cria um mock para o repositório de edificios
let mock = sinon.mock(edificioRepo); 
// Duas chamadas
let expectation = mock.expects("findByDomainId").exactly(2); 
// Primeira chamada
expectation.onCall(0).returns(Promise.resolve(edificioA));
// Segunda chamada  
expectation.onCall(1).returns(Promise.resolve(edificioB));  
 
Switer101 — 27/10/2023 21:26
ok
nice
nullPointerException — 28/10/2023 17:13
olha como o 6 trata de limitar o acesso por ssh mediante o uso de ip
eu no file /etc/remote-hosts deveria meter as nossas ip, só que não faz sentido pq eles estão constantemente mudando
Switer101 — 28/10/2023 17:14
poem so a que tens do nei neste momento para ver se esta a dar
nullPointerException — 28/10/2023 17:14
o que posso fazer é um teste dessa funcionalidade agora, e imediatamente após isso tira-la
Switer101 — 28/10/2023 17:14
e dps das reset a vpn e ja te muda o ip
nullPointerException — 28/10/2023 17:14
nei?
Switer101 — 28/10/2023 17:14
yh basicamente
yh
ip coonfig e tens la a da vpn
nullPointerException — 28/10/2023 17:15
mas eu ainda não consegui entrar por ssh xd
olha a 3 diz utilizadores, e o home directory deles... assumo que esse home directory é a /home que nós temos?
ou faço um para cada um?
um para luser1 outro para luser2 e assim
Switer101 — 28/10/2023 17:18
nos na altura tinhasmos feito uma para cada um deles acho
Switer101 — 02/11/2023 19:49
olha tens um erro no método save da sala
e no passagemRepo é igual
Switer101 — 02/11/2023 21:19
Imagem
na salaRepo o nome da interface é IPassagemRepo
olha outra coisa
Switer101 — 02/11/2023 21:26
o id da sala n sera uma string
pq os nomes das salas pelo moodle sao smp do genero BXXX
se calhar faz mais sentido o id da sala ser uma string inserida pelo utilizador 
Switer101 — 02/11/2023 22:55
http://localhost:4000/api/piso
{
    "codigo": "EdificioNaoExiste",
    "numeroPiso": -2,
    "descricaoPiso": "Piso -2"
}
nullPointerException — 03/11/2023 14:57
{
    "id": "203B",
    "codigoEdificio": "COD" ,
    "numeroPiso": "1" ,
    "descricao": "Sala 203B - Laboratorio" ,
    "categoria": "Laboratório"
}
nullPointerException — 03/11/2023 18:01
{
    "id": 5,
    "codigoEdificioA": "COD",
    "codigoEdificioB": "COD1",
    "numeroPisoA": 1 ,
    "numeroPisoB": 5
}
http://localhost:4000/api/passagem
Switer101 — 03/11/2023 20:01
{
	"info": {
		"_postman_id": "23f99b4d-f10b-4c83-861a-dce05ab2f55f",
		"name": "PisoTest",
		"schema": "https://schema.getpostman.com/json/collection/v2.0.0/collection.json",
		"_exporter_id": "30673359"
Expandir
PisoTest.postman_collection.json
11 KB
Switer101 — 11/11/2023 20:30
/* Sidebar Styles /
.sidebar {
    height: 100%;
    width: 15%; / Adjust this percentage as needed /
    position: fixed;
    top: 0;
    left: 0;
    background-color: #333;
    padding-top: 20px;
    z-index: 1; / Ensure the sidebar is above other content /
    overflow: visible; / Allow content inside the sidebar to be visible /
    display: flex;
    flex-direction: column;
}

.sidebar a {
    padding: 15px 25px;
    text-decoration: none;
    font-size: 20px;
    color: #fff;
    display: block;
    width: 87%;
}

.sidebar a:hover {
    background-color: #555;
}

/ Dropdown Styles /
.dropdown {
    position: relative;
}

.dropdown-content {
    display: none;
    background-color: #555;
    position: absolute;
    min-width: 200px;
    top: 0;
    left: 100%; / Position the dropdown to the right of the parent link /
    z-index: 2;
    margin-left: 10px; / Adjust the margin-left as needed /
    width: auto; / Set the width to auto for flexibility /
}

.dropdown-content a {
    width: 100%; / Set the width to 100% to make dropdown links flexible */
}

.dropdown:hover .dropdown-content {
    display: block;
}
Switer101 — 15/11/2023 17:36
tas ai????
Switer101 — 23/11/2023 20:47
fé
Switer101 — 24/11/2023 13:32
david
estas ai?
Switer101 — 24/11/2023 20:40
npx cypress open
Switer101 — 24/11/2023 21:18
i want to do incremental backup in linux where the inital snapashot is taken every sunday with the respective increments every day of the week. examples intial snapshot sunday, monday, to saturday incremental ones. and next sunday do a snapshot again and the other days of teh week the incremets to that snapshot
nullPointerException — 24/11/2023 21:50
https://chat.openai.com/share/bea4acd6-5d71-4790-b2d0-3c326ab05cad
ChatGPT
Linux Incremental Backup Setup
Shared via ChatGPT
Imagem
nullPointerException — Ontem às 18:10
x_origem: "5",
y_origem: "5",
piso_origem: "j2",
x_destino: "6",
y_destino: "6",
piso_destino: "g4",
 
Switer101 — Hoje às 02:41
:- use_module(library(http/json)).
:- use_module(library(http/json_convert)).
:- use_module(library(http/http_server)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_cors)).
:- use_module(library(http/http_json)).
Expandir
message_3.txt
12 KB
﻿
Switer101
switer101
O Racista
:- use_module(library(http/json)).
:- use_module(library(http/json_convert)).
:- use_module(library(http/http_server)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_cors)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_parameters)).
:- use_module(library(http/http_client)).

:- set_setting(http:cors, [*]).

:- http_handler('/prolog-api/atualizarBC', atualizarBC, [method(post)]).
:- http_handler('/prolog-api/elCaminho', elCaminho, [method(get)]).
:- http_handler('/prolog-api/elBfs', elBfs, [method(get)]).

atualizarBC(Request) :-
    cors_enable,
    format('Access-Control-Allow-Origin: ~w~n', [*]),
    format('Access-Control-Allow-Headers: ~w~n', [*]),
    http_read_data(Request, Data, [to(atom)]),
    save_file('bc.pl', Data),
    consult('bc.pl'),
    reply_json(['Base de conhecimento atualizada com sucesso!'], [json_object(dict)]).

save_file(FileName, Content) :-
    open(FileName, write, Stream),
    write(Stream, Content),
    close(Stream).

elCaminho(Request):-
    cors_enable,
    format('Access-Control-Allow-Origin: ~w~n', [*]),
    format('Access-Control-Allow-Headers: ~w~n', [*]),
    http_parameters(Request,
        [ ponto1(P1, []),
            ponto2(P2, []) 
        ]),
    once(el_caminho2(P1,P2,LCam,Cam1)),
    lcam_to_string_list(LCam, LCamStrList),
    term_to_json(Cam1, Cam1Json),
    Response = json{
        'LCam': LCamStrList,
        'Cam1': Cam1Json
    },
    reply_json(Response).

elBfs(Request):-
    cors_enable,
    format('Access-Control-Allow-Origin: ~w~n', [*]),
    format('Access-Control-Allow-Headers: ~w~n', [*]),
    http_parameters(Request,
        [ ponto1(P1, []),
            ponto2(P2, []) 
        ]),
    once(el_bfs1(P1,P2,LCam,Cam1)),
    lcam_to_string_list(LCam, LCamStrList),
    term_to_json(Cam1, Cam1Json),
    Response = json{
        'LCam': LCamStrList,
        'Cam1': Cam1Json
    },
    reply_json(Response).

lcam_to_string_list(LCam, LCamStrList) :-
    maplist(term_string, LCam, LCamStrList).

startServer(Port):-
    http_server(http_dispatch, [port(Port)]).

stopServer:-
    retract(port(Port)),
    http_stop_server(Port,_).

:- initialization(startServer(4400)).

:-dynamic node/4.
:-dynamic melhor_sol_dfs/2.
:-dynamic edge/3.
:-dynamic corredor/4.
:-dynamic elevador/2.
:-dynamic pisos/2.
:-dynamic liga/2.

caminho_edificios(EdOr,EdDest,LEdCam):-
    caminho_edificios2(EdOr,EdDest,[EdOr],LEdCam).
caminho_edificios2(EdX,EdX,LEdInv,LEdCam):-
    !,
    reverse(LEdInv,LEdCam).
                    
caminho_edificios2(EdAct,EdDest,LEdPassou,LEdCam):-
    (liga(EdAct,EdInt);liga(EdInt,EdAct)),
    \+member(EdInt,LEdPassou),
    caminho_edificios2(EdInt,EdDest,[EdInt|LEdPassou],LEdCam).


todos_caminhos_edificios(EdOr,EdDest,LTCamEd):-
    findall( LEdCam,
    caminho_edificios(EdOr,EdDest,LEdCam),LTCamEd).

caminho_pisos(PisoOr,PisoDest,LEdCam,LLig):-
    pisos(EdOr,LPisosOr),
    member(PisoOr,LPisosOr),
    pisos(EdDest,LPisosDest),
    member(PisoDest,LPisosDest),
    caminho_edificios(EdOr,EdDest,LEdCam),
    segue_pisos(PisoOr,PisoDest,LEdCam,LLig).
segue_pisos(PisoDest,PisoDest,_,[]).
segue_pisos(PisoDest1,PisoDest,[EdDest],[elev(PisoDest1,PisoDest)]):-
    PisoDest\==PisoDest1,
    elevador(EdDest,LPisos), 
    member(PisoDest1,LPisos), 
    member(PisoDest,LPisos).

segue_pisos(PisoAct,PisoDest,[EdAct,EdSeg|LOutrosEd],[cor(PisoAct,PisoSeg)|LOutrasLig]):-
    (corredor(EdAct,EdSeg,PisoAct,PisoSeg);corredor(EdSeg,EdAct,PisoSeg,PisoAct)),
    segue_pisos(PisoSeg,PisoDest,[EdSeg|LOutrosEd],LOutrasLig).

segue_pisos(PisoAct,PisoDest,[EdAct,EdSeg|LOutrosEd],[elev(PisoAct,PisoAct1),cor(PisoAct1,PisoSeg)|LOutrasLig]):-
    (corredor(EdAct,EdSeg,PisoAct1,PisoSeg);corredor(EdSeg,EdAct,PisoSeg,PisoAct1)),
    PisoAct1\==PisoAct,
    elevador(EdAct,LPisos),
    member(PisoAct,LPisos),
    member(PisoAct1,LPisos),
    segue_pisos(PisoSeg,PisoDest,[EdSeg|LOutrosEd],LOutrasLig).



melhor_caminho_pisos(PisoOr,PisoDest,LLigMelhor):-
    findall(LLig,caminho_pisos(PisoOr,PisoDest,_,LLig),LLLig),menos_elevadores(LLLig,LLigMelhor,_,_).
menos_elevadores([LLig],LLig,NElev,NCor):-conta(LLig,NElev,NCor).
menos_elevadores([LLig|OutrosLLig],LLigR,NElevR,NCorR):-
    menos_elevadores(OutrosLLig,LLigM,NElev,NCor),
    conta(LLig,NElev1,NCor1),
    (((NElev1<NElev;(NElev1==NElev,NCor1<NCor)),!,
    NElevR is NElev1, NCorR is NCor1,LLigR=LLig);
    (NElevR is NElev,NCorR is NCor,LLigR=LLigM)).
conta([],0,0).
conta([elev(_,_)|L],NElev,NCor):-
    conta(L,NElevL,NCor),
    NElev is NElevL+1.
                                
conta([cor(_,_)|L],NElev,NCor):-
    conta(L,NElev,NCorL),
    NCor is NCorL+1.

cria_grafo(_,_,0):-!.
cria_grafo(P,Col,Lin):-
    cria_grafo_lin(P,Col,Lin),
    Lin1 is Lin-1,
    node(P2,Col,Lin1,_),
    cria_grafo(P2,Col,Lin1).

cria_grafo_lin(_,0,_):-!.
cria_grafo_lin(P,Col,Lin):-
    node(P,Col,Lin),
    !,
    ColS is Col+1, 
    ColA is Col-1,  
    LinS is Lin+1,
    LinA is Lin-1,
    ((node(P2,ColS,Lin,0),assertz(edge(P,P2,0));true)),
    ((node(P3,ColA,Lin,0),assertz(edge(P,P3,0));true)),
    ((node(P4,Col,LinS,0),assertz(edge(P,P4,0));true)),
    ((node(P5,Col,LinA,0),assertz(edge(P,P5,0));true)),
    %((node(ColS,LinS,0),assertz(edge(cel(Col,Lin),cel(ColS,LinS),0));true)),
    %((node(ColA,LinA,0),assertz(edge(cel(Col,Lin),cel(ColA,LinA),0));true)),
    %((node(ColA,LinS,0),assertz(edge(cel(Col,Lin),cel(ColA,LinS),0));true)),
    %((node(ColS,LinA,0),assertz(edge(cel(Col,LinA),cel(ColS,LinA),0));true)),
    Col1 is Col-1,
    cria_grafo_lin(Col1,Lin).

cria_grafo_lin(Col,Lin):-
    Col1 is Col-1,
    cria_grafo_lin(Col1,Lin).

            
        





dfs(Orig,Dest,Cam):-
dfs2(Orig,Dest,[Orig],Cam).
dfs2(Dest,Dest,LA,Cam):-
                    reverse(LA,Cam).
dfs2(Act,Dest,LA,Cam):-
    edge(Act,X),\+ member(X,LA),
    dfs2(X,Dest,[X|LA],Cam).

all_dfs(Orig,Dest,LCam):-findall(Cam,dfs(Orig,Dest,Cam),LCam).

better_dfs(Orig,Dest,Cam):-
    all_dfs(Orig,Dest,LCam), 
    shortlist(LCam,Cam,_).

shortlist([L],L,N):-
    !,
    length(L,N).
shortlist([L|LL],Lm,Nm):-
    shortlist(LL,Lm1,Nm1),
    length(L,NL),
    ((NL<Nm1,!,Lm=L,Nm is NL);(Lm=Lm1,Nm is Nm1)).

bfs(Orig,Dest,Cam):-
    bfs2(Dest,[[Orig]],Cam).

bfs2(Dest,[[Dest|T]|_],Cam):-
    reverse([Dest|T],Cam).
bfs2(Dest,[LA|Outros],Cam):-
    LA=[Act|_],
    findall([X|LA],(Dest\==Act,edge(Act,X,1),\+ member(X,LA)),Novos),
    append(Outros,Novos,Todos),
    bfs2(Dest,Todos,Cam).

better_dfs1(Orig,Dest,LCaminho_minlig):-
    get_time(Ti),
    (better_dfs11(Orig,Dest);true),
    retract(melhor_sol_dfs(LCaminho_minlig,_)),
    get_time(Tf),
    T is Tf-Ti,
    write('Tempo de geracao da solucao:'),write(T),nl.
                                        
better_dfs11(Orig,Dest):-
    asserta(melhor_sol_dfs(_,10000)),
    dfs(Orig,Dest,LCaminho),
    atualiza_melhor_dfs(LCaminho),
    fail.

atualiza_melhor_dfs(LCaminho):-
    melhor_sol_dfs(_,N),
    length(LCaminho,C),
    C<N,retract(melhor_sol_dfs(_,_)),
    asserta(melhor_sol_dfs(LCaminho,C)).

aStar(Orig,Dest,Cam,Custo):-
    aStar2(Dest,[(_,0,[Orig])],Cam,Custo).
aStar2(Dest, [(_, Custo, [Dest | T]) | _], Cam, Custo):-
    reverse([Dest | T], Cam).
aStar2(Dest, [(_, Ca, LA) | Outros], Cam, Custo):-
    LA = [Act | _],
    findall((CEX, CaX, [X | LA]),
        (Dest \== Act, edge(Act, X, CustoX),
        \+ member(X, LA),
        CaX is CustoX + Ca, 
        estimativa(X, Dest, EstX),
        CEX is CaX + EstX,
        \+ member(X, LA),  % Ensure X is not already in the open list
        \+ member((_, _, [X | _]), Outros)),  % Ensure X is not already in the closed list
        Novos),
    append(Outros, Novos, Todos),
    sort(Todos, TodosOrd),
    aStar2(Dest, TodosOrd, Cam, Custo).

estimativa(Nodo1,Nodo2,Estimativa):-
    node(Nodo1,_,X1,Y1),
    node(Nodo2,_,X2,Y2),
    Estimativa is sqrt((X1-X2)^2+(Y1-Y2)^2).


bestfs(Orig,Dest,Cam):-
bestfs2(Dest,[Orig],Cam).
%condicao final: destino = nó à cabeça do caminho actual
bestfs2(Dest,[Dest|T],Cam):- !,
%caminho actual está invertido
reverse([Dest|T],Cam).
bestfs2(Dest,LA,Cam):-
LA=[Act|_],
%calcular todos os nodos adjacentes nao visitados e
% guardar um tuplo com estimativa e novo caminho
findall((EstX,[X|LA]),
(edge(Act,X),\+ member(X,LA), estimativa(X,Dest,EstX)),Novos),
%ordenar pela estimativa
sort(Novos,NovosOrd),
%extrair o melhor que está à cabeça
NovosOrd = [(_,Melhor)|_],
%chamada recursiva
bestfs2(Dest,Melhor,Cam).

remove_all_but_first_two(Var, Result) :-
    atom_length(Var, Length),
    Length > 2,
    sub_atom(Var, 0, 2, _, Result).




el_caminho2(P1, P2, [], Cam1):-
    node(P1, E, _, _),
    node(P2, E1, _, _),
    E = E1,
    !,
    once(aStar(P1, P2, Cam, _)),
    reverse(Cam, Cam1).

el_caminho2(P1, P2, LCam, Cam1):-
    node(P1, E, _, _),
    node(P2, E1, _, _),
    caminho_pisos(E, E1, _, LCam),
    el_caminho3(P1, P2, LCam, Cam),
    reverse(Cam, Cam1).
    
el_caminho3(P1,P2,[elev(E,E1)|_],[Cam1|RestCam]):-
    node(P2,E1,_,_),
    elevadorPos(E,X,Y),
    node(Pnext,E,X,Y),
    once(aStar(P1,Pnext,Cam1,_)),
    elevadorPos(E1,X,Y),
    node(Pnext2,E1,X,Y),
    el_caminho4(Pnext2,P2,RestCam).
                                        
el_caminho3(P1,P2,[elev(E,E1)|LCam],[Cam1|RestCam]):-
    elevadorPos(E,X,Y),
    node(Pnext,E,X,Y),
    once(aStar(P1,Pnext,Cam1,_)),
    elevadorPos(E1,X1,Y1),
    node(Pnext2,E1,X1,Y1),
    el_caminho3(Pnext2,P2,LCam,RestCam).

el_caminho3(P1,P2,[cor(E,E1)|_],[Cam1|RestCam]):-
    node(P2,E1,_,_),
    passagemPos(E,E1,X,Y),
    node(Pnext,E,X,Y),
    once(aStar(P1,Pnext,Cam1,_)),
    passagemPos(E1,E,X2,Y2),
    node(Pnext2,E1,X2,Y2),
    el_caminho4(Pnext2,P2,RestCam).

el_caminho3(P1,P2,[cor(E,E1)|LCam],[Cam1|RestCam]):-
    passagemPos(E,E1,X,Y),
    node(Pnext,E,X,Y),
    once(aStar(P1,Pnext,Cam1,_)),
    passagemPos(E1,E,X1,Y1),
    node(Pnext2,E1,X1,Y1),
    el_caminho3(Pnext2,P2,LCam,RestCam).

el_caminho4(P1,P2,[Cam|_]):-
    once(aStar(P1,P2,Cam,_)).


el_bfs1(P1,P2,_,Cam1):-
    node(P1,E,_,_),
    node(P2,E1,_,_),
    E=E1,
    !,
    once(bfs(P1,P2,Cam)),
    reverse(Cam,Cam1).

el_bfs1(P1,P2,LCam,Cam1):-
    node(P1,E,_,_),
    node(P2,E1,_,_),
    caminho_pisos(E,E1,_,LCam),
    el_caminho3(P1,P2,LCam,Cam),
    reverse(Cam,Cam1).

el_bfs2(P1,P2,[elev(E,E1)|_],[Cam1|RestCam]):-
    node(P2,E1,_,_),
    elevadorPos(E,X,Y),
    node(Pnext,E,X,Y),
    once(bfs(P1,Pnext,Cam1)),
    elevadorPos(E1,X,Y),
    node(Pnext2,E1,X,Y),
    el_caminho4(Pnext2,P2,RestCam).
    
el_bfs2(P1,P2,[elev(E,E1)|LCam],[Cam1|RestCam]):-
    elevadorPos(E,X,Y),
    node(Pnext,E,X,Y),
    once(bfs(P1,Pnext,Cam1)),
    elevadorPos(E1,X1,Y1),
    node(Pnext2,E1,X1,Y1),
    el_caminho3(Pnext2,P2,LCam,RestCam).

el_bfs2(P1,P2,[cor(E,E1)|_],[Cam1|RestCam]):-
    node(P2,E1,_,_),
    passagemPos(E,E1,X,Y),
    node(Pnext,E,X,Y),
    once(bfs(P1,Pnext,Cam1)),
    passagemPos(E1,E,X2,Y2),
    node(Pnext2,E1,X2,Y2),
    el_caminho4(Pnext2,P2,RestCam).

el_bfs2(P1,P2,[cor(E,E1)|LCam],[Cam1|RestCam]):-
    passagemPos(E,E1,X,Y),
    node(Pnext,E,X,Y),
    once(bfs(P1,Pnext,Cam1)),
    passagemPos(E1,E,X1,Y1),
    node(Pnext2,E1,X1,Y1),
    el_caminho3(Pnext2,P2,LCam,RestCam).

el_bfs3(P1,P2,[Cam|_]):-
    once(bfs(P1,P2,Cam)).
