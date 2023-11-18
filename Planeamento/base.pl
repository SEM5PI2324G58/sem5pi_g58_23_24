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

