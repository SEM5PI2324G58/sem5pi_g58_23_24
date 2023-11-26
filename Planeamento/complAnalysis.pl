:-dynamic ligacel/2.
:-dynamic m/3.
:-dynamic nlin/1.
:-dynamic melhor_sol_dfs/2.

%linha 1:1,1,1,1,1,1,1,1
%linha 2:0,0,0,0,0,0,0,1
%linha 3:0,0,0,0,0,0,0,1
%linha 4:0,0,0,0,0,0,0,1
%linha 5:1,1,1,1,0,0,0,1
%linha 6:1,1,1,1,0,0,0,1
%linha 7:1,1,1,1,0,0,0,1
%coluna :1,2,3,4,5,6,7,8
%
%
cria_matriz_Astar:-
	retractall(m(_,_,_)),
	retractall(ligacel(_,_)),
	write('Numero de Colunas: '),read(NCol),nl,
	write('Numero de Linhas: '),read(NLin),nl,asserta(nlin(NLin)),
	cria_matriz_0(NCol,NLin),criar_grafo_Astar(NCol,NLin),retract(nlin(_)).


cria_matriz:-
	retractall(m(_,_,_)),
	retractall(ligacel(_,_)),
	write('Numero de Colunas: '),read(NCol),nl,
	write('Numero de Linhas: '),read(NLin),nl,asserta(nlin(NLin)),
	cria_matriz_0(NCol,NLin),cria_grafo(NCol,NLin),retract(nlin(_)).


cria_matriz_0(1,1):-!,asserta(m(1,1,0)).
cria_matriz_0(NCol,1):-!,asserta(m(NCol,1,0)),NCol1 is NCol-1,nlin(NLin),cria_matriz_0(NCol1,NLin).
cria_matriz_0(NCol,NLin):-asserta(m(NCol,NLin,0)),NLin1 is NLin-1,cria_matriz_0(NCol,NLin1).

cria_grafo(_,0):-!.
cria_grafo(Col,Lin):-cria_grafo_lin(Col,Lin),Lin1 is Lin-1,cria_grafo(Col,Lin1).


cria_grafo_lin(0,_):-!.
cria_grafo_lin(Col,Lin):-m(Col,Lin,0),!,ColS is Col+1, ColA is Col-1, LinS is Lin+1,LinA is Lin-1,
    ((m(ColS,Lin,0),assertz(ligacel(cel(Col,Lin),cel(ColS,Lin)));true)),
    ((m(ColA,Lin,0),assertz(ligacel(cel(Col,Lin), cel(ColA,Lin)));true)),
    ((m(Col,LinS,0),assertz(ligacel(cel(Col,Lin), cel(Col,LinS)));true)),
    ((m(Col,LinA,0),assertz(ligacel(cel(Col,Lin), cel(Col,LinA)));true)),
    ((m(ColA,LinA,0),assertz(ligacel(cel(Col,Lin), cel(ColA,LinA)));true)),
    ((m(ColS,LinS,0),assertz(ligacel(cel(Col,Lin), cel(ColS,LinS)));true)),
    ((m(ColA,LinS,0),assertz(ligacel(cel(Col,Lin), cel(ColA,LinS)));true)),
    ((m(ColS,LinA,0),assertz(ligacel(cel(Col,Lin), cel(ColS,LinA)));true)),
    Col1 is Col-1,
    cria_grafo_lin(Col1,Lin).
cria_grafo_lin(Col,Lin):-Col1 is Col-1,cria_grafo_lin(Col1,Lin).

count_ligacel:-findall(ligacel(X,Y),ligacel(X,Y),L),length(L,N),write(N),nl.

dfs(Orig,Dest,Cam):-
    get_time(Ti),
    dfs2(Orig,Dest,[Orig],Cam),
    get_time(Tf),
    T is Tf-Ti,
    write('Tempo de geracao da solucao:'),write(T),nl.

dfs2(Dest,Dest,LA,Cam):-
	reverse(LA,Cam).

dfs2(Act,Dest,LA,Cam):-
	ligacel(Act,X),
        \+ member(X,LA),
	dfs2(X,Dest,[X|LA],Cam).


all_dfs(Orig,Dest,LCam):-findall(Cam,dfs(Orig,Dest,Cam),LCam).


better_dfs(Orig,Dest,Cam):-all_dfs(Orig,Dest,LCam), shortlist(LCam,Cam,_).


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




shortlist([L],L,N):-!,length(L,N).
shortlist([L|LL],Lm,Nm):-shortlist(LL,Lm1,Nm1),
				length(L,NL),
			((NL<Nm1,!,Lm=L,Nm is NL);(Lm=Lm1,Nm is Nm1)).


bfs(Orig,Dest,Cam):-
    get_time(Ti),
    bfs2(Dest,[[Orig]],Cam),
    get_time(Tf),
    T is Tf-Ti,
    write('Tempo de geracao da solucao:'),write(T),nl.

bfs2(Dest,[[Dest|T]|_],Cam):-
	reverse([Dest|T],Cam).

bfs2(Dest,[LA|Outros],Cam):-
	LA=[Act|_],
	findall([X|LA],
		(Dest\==Act,ligacel(Act,X),\+ member(X,LA)),
		Novos),
	append(Outros,Novos,Todos),
	bfs2(Dest,Todos,Cam).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

cria_grafo(_,0):-!.
cria_grafo(Col,Lin):-cria_grafo_lin(Col,Lin),Lin1 is Lin-1,cria_grafo(Col,Lin1).

cria_grafo_lin(0,_):-!.
cria_grafo_lin(Col,Lin):-m(Col,Lin,0),!,ColS is Col+1, ColA is Col-1, LinS is Lin+1,LinA is Lin-1, % Se não for parede ve os nodes á volta
    ((m(ColS,Lin,0),assertz(ligacel(cel(Col,Lin),cel(ColS,Lin)));true)),
    ((m(ColA,Lin,0),assertz(ligacel(cel(Col,Lin), cel(ColA,Lin)));true)),
    ((m(Col,LinS,0),assertz(ligacel(cel(Col,Lin), cel(Col,LinS)));true)),
    ((m(Col,LinA,0),assertz(ligacel(cel(Col,Lin), cel(Col,LinA)));true)),
    ((m(ColA,LinA,0),assertz(ligacel(cel(Col,Lin), cel(ColA,LinA)));true)),
    ((m(ColS,LinS,0),assertz(ligacel(cel(Col,Lin), cel(ColS,LinS)));true)),
    ((m(ColA,LinS,0),assertz(ligacel(cel(Col,Lin), cel(ColA,LinS)));true)),
    ((m(ColS,LinA,0),assertz(ligacel(cel(Col,Lin), cel(ColS,LinA)));true)),
    Col1 is Col-1,
    cria_grafo_lin(Col1,Lin).
cria_grafo_lin(Col,Lin):-Col1 is Col-1,cria_grafo_lin(Col1,Lin). %% Se o ponto for parede dá skip

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%% Criar grafo - A* %%%%%%%%%%%%%%%%%%%%

%%%% Criar nodes %%%%
criar_nodes():-
    findall(m(X,Y,0),m(X,Y,0),Res),
    criar_nodes1(Res,0).

criar_nodes1([],_).
criar_nodes1([m(X,Y,0)|RL],Id):-
    Id1 is Id+1,
    assertz(node(Id1,X,Y)),
    criar_nodes1(RL,Id1).

%%%% Criar edges auxiliares %%%%

cria_edges_Aux(_,0):-!.
cria_edges_Aux(Col,Lin):-cria_grafo_lin1(Col,Lin),Lin1 is Lin-1,cria_edges_Aux(Col,Lin1).

cria_grafo_lin1(0,_):-!.
cria_grafo_lin1(Col,Lin):-m(Col,Lin,0),!,ColS is Col+1, ColA is Col-1, LinS is Lin+1,LinA is Lin-1, % Se não for parede ve os nodes á volta
    ((m(ColS,Lin,0),assertz(edge(Col,Lin,ColS,Lin,1));true)),
    ((m(ColA,Lin,0),assertz(edge(Col,Lin,ColA,Lin,1));true)),
    ((m(Col,LinS,0),assertz(edge(Col,Lin,Col,LinS,1));true)),
    ((m(Col,LinA,0),assertz(edge(Col,Lin,Col,LinA,1));true)),
    ((m(ColA,LinA,0),assertz(edge(Col,Lin,ColA,LinA,sqrt(2)));true)),
    ((m(ColS,LinS,0),assertz(edge(Col,Lin,ColS,LinS,sqrt(2)));true)),
    ((m(ColA,LinS,0),assertz(edge(Col,Lin,ColA,LinS,sqrt(2)));true)),
    ((m(ColS,LinA,0),assertz(edge(Col,Lin,ColS,LinA,sqrt(2)));true)),
    Col1 is Col-1,
    cria_grafo_lin1(Col1,Lin).
cria_grafo_lin1(Col,Lin):-Col1 is Col-1,cria_grafo_lin1(Col1,Lin). %% Se o ponto for parede dá skip

%%%% Criar edges %%%%

criar_edges_Astar():-
    findall(edge(Col,Lin,ColS,LinS,Custo),edge(Col,Lin,ColS,LinS,Custo),Res),
    criar_edges1(Res).

criar_edges1([]).
criar_edges1([edge(Col,Lin,ColS,LinS,Custo)|RL]):-
    node(Id1,Col,Lin),
    node(Id2,ColS,LinS),
    assertz(edge(Id1,Id2,Custo)),
    criar_edges1(RL).

%%%% Criar grafo (reunião dos métodos acima)%%%%

criar_grafo_Astar(X,Y):-
    eliminar_grafo_Astar(),
    criar_nodes(),
    cria_edges_Aux(X,Y),
    criar_edges_Astar(),
    retractall(edge(_,_,_,_,_)).

%%%% Eliminar grafo ()%%%%

eliminar_grafo_Astar():-
    retractall(node(_,_,_)),
    retractall(edge(_,_,_)).

%%%% A* %%%%
aStar(Orig,Dest,Cam,Custo):-
    get_time(Ti),
    aStar2(Dest,[(_,0,[Orig])],Cam,Custo),
    get_time(Tf),
    T is Tf-Ti,
    write('Tempo de geracao da solucao:'),write(T),nl.

aStar2(Dest,[(_,Custo,[Dest|T])|_],Cam,Custo):-
	reverse([Dest|T],Cam).

aStar2(Dest,[(_,Ca,LA)|Outros],Cam,Custo):-
	LA=[Act|_],
	findall((CEX,CaX,[X|LA]),
		(Dest\==Act,(edge(Act,X,CustoX);edge(X,Act,CustoX)),\+ member(X,LA),
		CaX is CustoX + Ca, estimativa(X,Dest,EstX),
		CEX is CaX +EstX),Novos),
	append(Outros,Novos,Todos),
	sort(Todos,TodosOrd),
	aStar2(Dest,TodosOrd,Cam,Custo).

% heuristica é a distância euclidiana entre dois pontos
estimativa(Nodo1,Nodo2,Estimativa):-
	node(Nodo1,X1,Y1),
	node(Nodo2,X2,Y2),
	Estimativa is sqrt((X1-X2)^2+(Y1-Y2)^2).