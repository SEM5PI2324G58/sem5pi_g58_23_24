% Dados que vão ser obtidos atraves do pedido da informação do mapa ao MDRI
% Lista de pisos de cada edifício
% pisos(IdEdificio,[IdPiso1,IdPiso2,IdPiso3])
pisos(x,[x1,x2]).
pisos(y,[y2]).
pisos(z,[z2]).

% Lista pisos que um elevador de um edificio serve
% elevador(IdEdificio,[IdPiso1,IdPiso2,IdPiso3])
elevador(x,[x1,x2]).

% Coordenada dos elevadores
% coordElevador(IdEdificio,x,y)
coordElevador(x,4,4).

% Corredores que ligam pisos de um edificio
% corredor(IdEdificio1,IdEdificio2,IdPiso1,IdPiso2)
corredor(x,y,x2,y2).
corredor(y,z,y2,z2).

% Coordenada dos corredores
% coordCorredor(IdPisoA,IdPisoB,xA1,yA1,xA2,yA2,xB1,yB1,xB2,yB2)
coordCorredor(x2,y2,4,1,4,2,1,1,1,2).
coordCorredor(y2,z2,1,4,2,4,1,1,2,1).

% Lista de salas de cada piso
% salas(IdPiso,[IdSala1,IdSala2,IdSala3])
salas(x1,[x101]).
salas(x2,[x201]).
salas(y2,[y201]).
salas(z2,[z201]).

% Coordenada das portas (ponto de acesso) das salas
coordPorta(x101,3,2).
coordPorta(x201,2,2).
coordPorta(y201,4,2).
coordPorta(z201,3,3).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Informação que vai ser gerada a partir do dados iniciais
liga(x,y).
liga(y,z).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%Parte 2 - caminho no piso
% Informação de um grafo para o A*

% node(id,X,Y)

% edge(idNode1,idNode2,custo)

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%Matrix X1
m(x1,1,1,0).
m(x1,2,1,0).
m(x1,3,1,1).
m(x1,4,1,1).

m(x1,1,2,0).
m(x1,2,2,0).
m(x1,3,2,0).
m(x1,4,2,1).

m(x1,1,3,0).
m(x1,2,3,0).
m(x1,3,3,0).
m(x1,4,3,0).

m(x1,1,4,0).
m(x1,2,4,0).
m(x1,3,4,0).
m(x1,4,4,0).

%Matrix X2
m(x2,1,1,1).
m(x2,2,1,1).
m(x2,3,1,0).
m(x2,4,1,0).

m(x2,1,2,1).
m(x2,2,2,0).
m(x2,3,2,0).
m(x2,4,2,0).

m(x2,1,3,1).
m(x2,2,3,1).
m(x2,3,3,0).
m(x2,4,3,0).

m(x2,1,4,1).
m(x2,2,4,1).
m(x2,3,4,0).
m(x2,4,4,0).

%Matrix Y2
m(y2,1,1,0).
m(y2,2,1,0).
m(y2,3,1,1).
m(y2,4,1,1).

m(y2,1,2,0).
m(y2,2,2,0).
m(y2,3,2,1).
m(y2,4,2,0).

m(y2,1,3,0).
m(y2,2,3,0).
m(y2,3,3,0).
m(y2,4,3,0).

m(y2,1,4,0).
m(y2,2,4,0).
m(y2,3,4,0).
m(y2,4,4,0).

%Matrix X2
m(z2,1,1,0).
m(z2,2,1,0).
m(z2,3,1,0).
m(z2,4,1,0).

m(z2,1,2,0).
m(z2,2,2,0).
m(z2,3,2,0).
m(z2,4,2,0).

m(z2,1,3,1).
m(z2,2,3,1).
m(z2,3,3,0).
m(z2,4,3,1).

m(z2,1,4,1).
m(z2,2,4,1).
m(z2,3,4,1).
m(z2,4,4,1).