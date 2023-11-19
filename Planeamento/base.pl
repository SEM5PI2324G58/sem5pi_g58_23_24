% Dados que vão ser obtidos atraves do pedido da informação do mapa ao MDRI

% Lista de pisos de cada edifício
% pisos(IdEdificio,[IdPiso1,IdPiso2,IdPiso3])
pisos(a,[a1]).
pisos(b,[b1,b2,b3,b4]).
pisos(g,[g2,g3,g4]).
pisos(h,[h1,h2,h3,h4]).
pisos(i,[i1,i2,i3,i4]).
pisos(j,[j1,j2,j3,j4]).

% Lista pisos que um elevador de um edificio serve
% elevador(IdEdificio,[IdPiso1,IdPiso2,IdPiso3])
elevador(b,[b1,b2,b3,b4]).
elevador(g,[g2,g3,g4]).
elevador(i,[i1,i2,i3,i4]).
elevador(j,[j1,j2,j3,j4]).

% Coordenada dos elevadores
% coordElevador(IdEdificio,x,y)
coordElevador(b,1,1).
coordElevador(g,2,2).
coordElevador(i,3,3).
coordElevador(j,4,4).


% Corredores que ligam pisos de um edificio
% corredor(IdEdificio1,IdEdificio2,IdPiso1,IdPiso2)
corredor(a,h,a1,h2).
corredor(b,g,b2,g2).
corredor(b,g,b3,g3).
corredor(b,i,b3,i3).
corredor(g,h,g2,h2).
corredor(g,h,g3,h3).
corredor(h,i,h2,i2).
corredor(i,j,i1,j1).
corredor(i,j,i2,j2).
corredor(i,j,i3,j3).

% Coordenada dos corredores
% coordCorredor(IdPisoA,IdPisoB,xA1,yA1,xA2,yA2,xB1,yB1,xB2,yB2)
coordCorredor(a1,h2,2,2,2,3,0,0,0,1).

% Lista de salas de cada piso
% salas(IdPiso,[IdSala1,IdSala2,IdSala3])
%(...) Apenas salas no j2 e g4 para funcionar com o exemplo "caminho_pisos(j2,g4,LEdCam,LLig)"
salas(a2,[a201]).
salas(j2,[j201]).
salas(g4,[g401,g402]).

% Coordenada das portas (ponto de acesso) das salas
coordPorta(a201,5,5).
coordPorta(j201,5,5).
coordPorta(g401,6,6).
coordPorta(g402,7,7).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Informação que vai ser gerada a partir do dados iniciais
liga(a,h).
liga(b,g).
liga(b,i).
liga(g,h).
liga(h,i).
liga(i,j).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%Parte 2 - caminho no piso

% Informação de um grafo para o A* (exemplo moodle do apoio3)
% node(id,X,Y)
node(a,45,95).
node(b,90,95).
node(c,15,85).
node(d,40,80).
node(e,70,80).
node(f,25,65).
node(g,65,65).
node(h,45,55).
node(i,5,50).
node(j,80,50).
node(l,65,45).
node(m,25,40).
node(n,55,30).
node(o,80,30).
node(p,25,15).
node(q,80,15).
node(r,55,10).

% edge(idNode1,idNode2,custo)
edge(a,b,45).
edge(a,c,32).
edge(a,d,16).
edge(a,e,30).
edge(b,e,25).
edge(d,e,30).
edge(c,d,26).
edge(c,f,23).
edge(c,i,37).
edge(d,f,22).
edge(f,h,23).
edge(f,m,25).
edge(f,i,25).
edge(i,m,23).
edge(e,f,48).
edge(e,g,16).
edge(e,j,32).
edge(g,h,23).
edge(g,l,20).
edge(g,j,22).
edge(h,m,25).
edge(h,n,27).
edge(h,l,23).
edge(j,l,16).
edge(j,o,20).
edge(l,n,19).
edge(l,o,22).
edge(m,n,32).
edge(m,p,25).
edge(n,p,34).
edge(n,r,20).
edge(o,n,25).
edge(o,q,15).
edge(p,r,31).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Obter o caminho entre edificios
% ?- caminho_edificios(j,a,LEdCam).
% LEdCam = [j, i, b, g, h, a] ;
% LEdCam = [j, i, h, a]
caminho_edificios(EdOr,EdDest,LEdCam):-
    caminho_edificios2(EdOr,EdDest,[EdOr],LEdCam).


caminho_edificios2(EdX,EdX,LEdInv,LEdCam):-
    !,
    reverse(LEdInv,LEdCam).

caminho_edificios2(EdAct,EdDest,LEdPassou,LEdCam):-
    (liga(EdAct,EdInt);liga(EdInt,EdAct)),
    \+member(EdInt,LEdPassou),
    caminho_edificios2(EdInt,EdDest,[EdInt|LEdPassou],LEdCam).




% c encontrar um caminho entre pisos de edificios usando corredores e
% elevadores 40%
%
% ?- caminho_pisos(j2,g4,LEdCam,LLig).
%(Exemplo de uma solução)
%LEdCam = [j, i, b, g],
% LLig = [cor(j2, i2), elev(i2, i3), cor(i3, b3), cor(b3, g3), elev(g3,g4)] ;
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

% encontrar um caminho entre pontos de pisos usando o predicado caminho_pisos() já definido
% apenas pontos que correspondem a portas de salas, elevadores e corredores sáo válidos
% Solução esperada é do memso tipo da solução do predicado caminho_pisos(j2,g4,LEdCam,LLig) (linha 94 e 95)

caminho_pontos_piso(XOrig,YOrig,PisoOrig,XDest,YDest,PisoDest,LEdCam,LLig):-
    ponto_valido(XOrig,YOrig,PisoOrig),
    ponto_valido(XDest,YDest,PisoDest),
    caminho_pisos(PisoOrig,PisoDest,LEdCam,LLig).

% piso correspondente a uma sala
% 

ponto_valido(X,Y,Piso):-
    is_sala(X,Y,Piso);
    is_elevador(X,Y,Piso);
    is_corredor(X,Y,Piso).
    

is_sala(X,Y,Piso):-
    coordPorta(IdSala,X,Y),
    salas(Piso,LSalas),
    member(IdSala,LSalas),
    !.

is_elevador(X,Y,Piso):-
    coordElevador(Elev,X,Y),
    elevador(Elev,LPisosElev),
    member(Piso,LPisosElev),
    !.

is_corredor(X,Y,Piso):-
    (
        (coordCorredor(PisoA,_,X,Y,_,_,_,_,_,_);coordCorredor(PisoA,_,_,_,X,Y,_,_,_,_)),
        !,
        Piso == PisoA
    );
    (
        (coordCorredor(_,PisoB,_,_,_,_,X,Y,_,_);coordCorredor(_,PisoB,_,_,_,_,_,_,X,Y)),
        !,
        Piso == PisoB
    ).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Algoritmo A* para encontrar o caminho entre dois pontos de um piso

aStar(Orig,Dest,Cam,Custo):-
    aStar2(Dest,[(_,0,[Orig])],Cam,Custo).

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

