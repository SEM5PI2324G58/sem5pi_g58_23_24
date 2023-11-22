import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { IdMapa } from "./IdMapa";
import { TipoPonto } from "./TipoPonto";
import { CoordenadasPassagem } from "./CoordenadasPassagem";
import { CoordenadasElevador } from "./CoordenadasElevador";
import { CoordenadasSala } from "./CoordenadasSala";


interface pisoProps {
    mapa: TipoPonto[][];
    coordenadasPassagem?: CoordenadasPassagem[];
    coordenadasElevador?: CoordenadasElevador;
    coordenadasSala?: CoordenadasSala[]; 

}

export class Mapa extends AggregateRoot<pisoProps> {

  private constructor (props : pisoProps, id?: IdMapa) {
      super(props,id);
  }

  public static create (props: pisoProps, id?: IdMapa): Result<Mapa> {

    const guardedProps = [
      { argument: props.mapa, argumentName: 'mapa' },
      { argument: props.coordenadasElevador, argumentName: 'coordenadasElevador' },
      { argument: props.coordenadasPassagem, argumentName: 'coordenadasPassagem' },
      { argument: props.coordenadasSala, argumentName: 'coordenadasSala' },
    ];
    
    let guard = Guard.againstNullOrUndefined(id,'Id Mapa');

    let guardResult = Guard.combine([guard]);

    if (!guardResult.succeeded) {
      return Result.fail<Mapa>(guardResult.message)
    }     
    else {
      const piso = new Mapa({
        ...props
      }, id);

      return Result.ok<Mapa>(piso);
    }
  }

  public returnTipoDePontos(): string[][] {
    let dados : string[][] = [];
    for (let i = 0; i < this.props.mapa.length; i++) {
      dados[i]=[];
      for (let j = 0; j < this.props.mapa[i].length; j++) {
        dados[i][j] = this.props.mapa[i][j].returnTipoPonto();
      }
    }
    return dados;
  }

  public returnIdMapa(): number {
    return Number(this.id.toValue());
  }

  public verificaSeExistePassagens(): boolean {
    if (this.props.coordenadasPassagem.length > 0) {
      return true;
    }
    return false;
  }

  public returnIdPassagem(): number[] {
    let dados : number[] = [];
    for (let i = 0; i < this.props.coordenadasPassagem.length; i++) {
      dados[i] = this.props.coordenadasPassagem[i].returnId();
    }
    return dados;
  }

  public returnAbcissaSupPassagem(): number[] {
    let dados : number[] = [];
    for (let i = 0; i < this.props.coordenadasPassagem.length; i++) {
      dados[i] = this.props.coordenadasPassagem[i].returnAbcissaSup();
    }
    return dados;
  }

  public returnOrdenadaSupPassagem(): number[] {
    let dados : number[] = [];
    for (let i = 0; i < this.props.coordenadasPassagem.length; i++) {
      dados[i] = this.props.coordenadasPassagem[i].returnOrdenadaSup();
    }
    return dados;
  }

  public returnAbcissaInfPassagem(): number[] {
    let dados : number[] = [];
    for (let i = 0; i < this.props.coordenadasPassagem.length; i++) {
      dados[i] = this.props.coordenadasPassagem[i].returnAbcissaInf();
    }
    return dados;
  }

  public returnOrdenadaInfPassagem(): number[] {
    let dados : number[] = [];
    for (let i = 0; i < this.props.coordenadasPassagem.length; i++) {
      dados[i] = this.props.coordenadasPassagem[i].returnOrdenadaInf();
    }
    return dados;
  }

  public returnOrientacaoPassagem(): string[] {
    let dados : string[] = [];
    for (let i = 0; i < this.props.coordenadasPassagem.length; i++) {
      dados[i] = this.props.coordenadasPassagem[i].returnOrientacao();
    }
    return dados;
  }

  public verificaSeExisteElevador(): boolean {
    if (this.props.coordenadasElevador !== null && this.props.coordenadasElevador !== undefined) {
      return true;
    }
    return false;
  }

  public returnXCoordElevador(): number[] {
    return this.props.coordenadasElevador.returnXCoord();
  }

  public returnYCoordElevador(): number[] {
    return this.props.coordenadasElevador.returnYCoord();
  }

  public returnOrientacaoElevador(): string {
    return this.props.coordenadasElevador.returnOrientacao();
  }

  public verificaSeExisteSalas(): boolean {
    if (this.props.coordenadasSala.length > 0) {
      return true;
    }
    return false;
  }

  public returnNomeSala(): string[] {
    let dados : string[] = [];
    for (let i = 0; i < this.props.coordenadasSala.length; i++) {
      dados[i] = this.props.coordenadasSala[i].returnNome();
    }
    return dados;
  }

  public returnAbcissaASala(): number[] {
    let dados : number[] = [];
    for (let i = 0; i < this.props.coordenadasSala.length; i++) {
      dados[i] = this.props.coordenadasSala[i].returnAbcissaA();
    }
    return dados;
  }

  public returnOrdenadaASala(): number[] {
    let dados : number[] = [];
    for (let i = 0; i < this.props.coordenadasSala.length; i++) {
      dados[i] = this.props.coordenadasSala[i].returnOrdenadaA();
    }
    return dados;
  }

  public returnAbcissaBSala(): number[] {
    let dados : number[] = [];
    for (let i = 0; i < this.props.coordenadasSala.length; i++) {
      dados[i] = this.props.coordenadasSala[i].returnAbcissaB();
    }
    return dados;
  }

  public returnOrdenadaBSala(): number[] {
    let dados : number[] = [];
    for (let i = 0; i < this.props.coordenadasSala.length; i++) {
      dados[i] = this.props.coordenadasSala[i].returnOrdenadaB();
    }
    return dados;
  }

  public returnAbcissaPortaSala(): number[] {
    let dados : number[] = [];
    for (let i = 0; i < this.props.coordenadasSala.length; i++) {
      dados[i] = this.props.coordenadasSala[i].returnAbcissaPorta();
    }
    return dados;
  }

  public returnOrdenadaPortaSala(): number[] {
    let dados : number[] = [];
    for (let i = 0; i < this.props.coordenadasSala.length; i++) {
      dados[i] = this.props.coordenadasSala[i].returnOrdenadaPorta();
    }
    return dados;
  }

  public returnOrientacaoPortaSala(): string[] {
    let dados : string[] = [];
    for (let i = 0; i < this.props.coordenadasSala.length; i++) {
      dados[i] = this.props.coordenadasSala[i].returnOrientacaoPorta();
    }
    return dados;
  }

  public verificarSeMapaVazio() : boolean{
    if(this.props.mapa === undefined || this.props.mapa === null){
      return true;
    }
    let x = this.props.mapa.length;
    let y = this.props.mapa[0].length;
    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y ; j++) {
        if(this.props.mapa[i][j].returnTipoPonto() !== " "){
          return false;
        }
      }
    }
    return true;
  }

  public criacaoBermasPiso() : TipoPonto[]{
    let x = this.props.mapa[0].length - 1;
    let y = this.props.mapa.length - 1;

    let listaPontos : TipoPonto[] = [];
    for (let i = 0; i <= x; i++) {
      for (let j = 0; j <= y ; j++) {
          if(i == 0 && j ==0 ) {
            this.toParedeNorteOeste(i,j);
            listaPontos.push(this.props.mapa[i][j]);
          }
          else if((1 <= i && i < x && (j == 0 || j == y)) || (i == 0 && j == y)) {
            this.toParedeNorte(i,j);
            listaPontos.push(this.props.mapa[i][j]);
          }
          else if((1 <= j && j < y && (i == 0 || i == x)) || (i == x && j == 0)) {
            this.toParedeOeste(i,j);
            listaPontos.push(this.props.mapa[i][j]);
          }
          else{this.toVazio(i,j)}
      }
    }  
    return listaPontos;
  }

  public toElevador(x:number, y:number, orientacao:string) {
    this.props.mapa[x][y] = TipoPonto.create("Elevador").getValue();
    if(this.props.coordenadasElevador === undefined || this.props.coordenadasElevador === null){
      this.props.coordenadasElevador = CoordenadasElevador.create({xCoord: [x], yCoord: [y], orientacao: orientacao}).getValue();
    }else{
      let antigoXCoord = this.props.coordenadasElevador.returnXCoord()[0];
      let antigoYCoord = this.props.coordenadasElevador.returnYCoord()[0];
      this.props.coordenadasElevador = CoordenadasElevador.create({xCoord: [antigoXCoord, x], yCoord: [antigoYCoord, y], orientacao: orientacao}).getValue();
    }
  }

  public toParedeNorteOeste(x:number, y:number) {
    this.props.mapa[x][y] = TipoPonto.create("NorteOeste").getValue();
  }

  public toParedeNorte(x:number, y:number) {
    this.props.mapa[x][y] = TipoPonto.create("Norte").getValue();
  }

  public toParedeOeste(x:number, y:number) {
    this.props.mapa[x][y] = TipoPonto.create("Oeste").getValue();
  }

  public toVazio(x:number, y:number) {
    this.props.mapa[x][y] = TipoPonto.create(" ").getValue();
  }

  public toPassagem(x:number, y:number) {
    this.props.mapa[x][y] = TipoPonto.create("Passagem").getValue();
  }

  public toPorta(x:number, y:number) {
    this.props.mapa[x][y] = TipoPonto.create("Porta").getValue();
  }

  public toPassagemNorte(x:number, y:number) {
    this.props.mapa[x][y] = TipoPonto.create("PassagemNorte").getValue();
  }

  public toPassagemOeste(x:number, y:number) {
    this.props.mapa[x][y] = TipoPonto.create("PassagemOeste").getValue();

  }
  public toPortaNorte(x:number, y:number) {
    this.props.mapa[x][y] = TipoPonto.create("PortaNorte").getValue();
  }
  public toPortaOesteNorteOeste(x:number, y:number) {
    this.props.mapa[x][y] = TipoPonto.create("PortaNorteOeste").getValue();
  }
  public toPortaNorteNorteOeste(x:number, y:number) {
    this.props.mapa[x][y] = TipoPonto.create("PortaNorteOeste").getValue();
  }
  public toPortaOeste(x:number, y:number) {
    this.props.mapa[x][y] = TipoPonto.create("PortaOeste").getValue();
  }

  public carregarMapaComBermas(){

    let x = this.props.mapa[0].length - 1;
    let y = this.props.mapa.length - 1;

    for (let i = 0; i <= x; i++) {
      for (let j = 0; j <= y ; j++) {
          if(i == 0 && j ==0 ) {
            this.toParedeNorteOeste(i,j);
          }
          else if((1 <= i && i < x && (j == 0 || j == y)) || (i == 0 && j == y)) {
            this.toParedeNorte(i,j);
          }
          else if((1 <= j && j < y && (i == 0 || i == x)) || (i == x && j == 0)) {
            this.toParedeOeste(i,j);
          }
          else{this.toVazio(i,j);}
      }
    }  
  }

  public criarPontosElevador(xCoordSup: number, yCoordSup: number, orientacao : string): boolean{
    let xCoordInf;
    let yCoordInf;

    if (orientacao === 'Norte') {
      xCoordInf = xCoordSup + 1;
      yCoordInf = yCoordSup;
    }else if (orientacao === 'Oeste') {
      xCoordInf = xCoordSup;
      yCoordInf = yCoordSup + 1;
    }
    if(this.props.mapa.length <= xCoordInf || this.props.mapa[0].length <= yCoordInf){
      return false;
    }
    this.toElevador(xCoordSup,yCoordSup, orientacao);
    this.toElevador(xCoordInf,yCoordInf, orientacao);
    return true;    
  }

  public carregarSalaMapa(nome:string, abcissaA : number, ordenadaA : number, abcissaB : number, ordenadaB : number,
    abcissaPorta : number, ordenadaPorta : number, orientacaoPorta : string) : boolean{
    let xCoordSup;
    let yCoordSup;
    let xCoordInf;
    let yCoordInf;

    if(abcissaA < abcissaB){
    xCoordSup = abcissaA;
    xCoordInf = abcissaB;
    }else{
    xCoordSup = abcissaB;
    xCoordInf = abcissaA;
    }
    if(ordenadaA < ordenadaB){
    yCoordSup = ordenadaA;
    yCoordInf = ordenadaB;
    }else{
    yCoordSup = ordenadaB;
    yCoordInf = ordenadaA;
    }

    if(this.props.mapa.length <= xCoordInf || this.props.mapa[0].length <= yCoordInf){
      return false;
    }
    this.toParedeNorteOeste(xCoordSup,yCoordSup);
    this.carregarCoordenadasSala(nome, xCoordSup, yCoordSup, xCoordInf, yCoordInf, abcissaPorta,
      ordenadaPorta, orientacaoPorta);
    if(orientacaoPorta === 'Norte'){
      this.toPortaNorte(abcissaPorta,ordenadaPorta);
    }else {
      this.toPortaOeste(abcissaPorta,ordenadaPorta);
    }
    for(let i = xCoordSup + 1; i <= xCoordInf; i++){
      if(!(i === abcissaPorta && yCoordSup === ordenadaPorta)){
        if(this.props.mapa[i][yCoordSup].returnTipoPonto() === 'Oeste'){
          this.toParedeNorteOeste(i,yCoordSup);
        }else{
        this.toParedeNorte(i,yCoordSup);
        }
      }else{
        if(this.props.mapa[i][yCoordSup].returnTipoPonto() === 'Oeste'){
          if(orientacaoPorta === 'Norte'){
            this.toPortaNorteNorteOeste(abcissaPorta,ordenadaPorta);
          }else{
            this.toPortaOesteNorteOeste(abcissaPorta,ordenadaPorta);
          }
        }else{
          this.toPortaNorte(abcissaPorta,ordenadaPorta);
        }
      }
    }

    for(let i = xCoordSup; i <= xCoordInf; i++){
      if(!(i === abcissaPorta && yCoordInf + 1 === ordenadaPorta)){
        if(this.props.mapa[i][yCoordInf + 1].returnTipoPonto() === 'Oeste'){
          this.toParedeNorteOeste(i,yCoordInf + 1);
        }else{
          this.toParedeNorte(i,yCoordInf + 1);
        }
      }else{
        if(this.props.mapa[i][yCoordInf + 1].returnTipoPonto() === 'Oeste'){
          if(orientacaoPorta === 'Norte'){
            this.toPortaNorteNorteOeste(abcissaPorta,ordenadaPorta);
          }else{
            this.toPortaOesteNorteOeste(abcissaPorta,ordenadaPorta);
          }
        }else{
          this.toPortaNorte(abcissaPorta,ordenadaPorta);
        }
      }
    }

    for(let i = yCoordSup + 1; i <= yCoordInf; i++){
      if(!(xCoordSup === abcissaPorta && i === ordenadaPorta)){
        this.toParedeOeste(xCoordSup,i);
      }else{
        this.toPortaOeste(abcissaPorta,ordenadaPorta);
      }
    }

    for(let i = yCoordSup; i <= yCoordInf; i++){
      if(!(xCoordInf + 1 === abcissaPorta && i === ordenadaPorta)){
        if(this.props.mapa[xCoordInf + 1][i].returnTipoPonto() === 'Norte'){
          this.toParedeNorteOeste(xCoordInf + 1,i);
        }else{
          this.toParedeOeste(xCoordInf + 1,i);
        }
      }else{
        if(this.props.mapa[xCoordInf + 1][i].returnTipoPonto() === 'Norte'){
          if(orientacaoPorta === 'Norte'){
            this.toPortaNorteNorteOeste(abcissaPorta,ordenadaPorta);
          }else{
            this.toPortaOesteNorteOeste(abcissaPorta,ordenadaPorta);
          }
        }else{
          this.toPortaOeste(abcissaPorta,ordenadaPorta);
        }
      }
    }
    return true;
  }

  public carregarPassagemMapa(passagem : any){
    let xCoordSup = passagem.abcissa;
    let yCoordSup = passagem.ordenada;
    let orientacao = passagem.orientacao;
    if(this.props.mapa.length <= xCoordSup || this.props.mapa[0].length <= yCoordSup){
      return false;
    }
    if (orientacao === 'Norte'){
      
      if(this.props.mapa[xCoordSup][yCoordSup].returnTipoPonto() === 'Oeste' || this.props.mapa[xCoordSup][yCoordSup].returnTipoPonto() === 'NorteOeste'){
        this.toPassagemOeste(xCoordSup,yCoordSup);
      }else{
        this.toPassagem(xCoordSup,yCoordSup);
      }
      if(this.props.mapa.length <= xCoordSup + 1){
        return false;
      }
      this.toPassagem(xCoordSup + 1,yCoordSup);
      this.carregarCoordenadasPassagem(passagem.id, xCoordSup,yCoordSup,xCoordSup + 1, yCoordSup, orientacao);
      
    }else if(orientacao === 'Oeste'){
      if(this.props.mapa[xCoordSup][yCoordSup].returnTipoPonto() === 'Norte' || this.props.mapa[xCoordSup][yCoordSup].returnTipoPonto() === 'NorteOeste'){
        this.toPassagemNorte(xCoordSup,yCoordSup);
      }else{
        this.toPassagem(xCoordSup,yCoordSup);
      }
      if(this.props.mapa[0].length <= yCoordSup + 1){
        return false;
      }
      this.toPassagem(xCoordSup,yCoordSup + 1);
      this.carregarCoordenadasPassagem(passagem.id, xCoordSup,yCoordSup, xCoordSup, yCoordSup + 1, orientacao);
    }
    return true;
  }

  public returnDimensaoX() : number{
    return this.props.mapa.length;
  }

  public returnDimensaoY() : number{
    return this.props.mapa[0].length;
  }

  public carregarCoordenadasPassagem(id:number, abcissaSup : number, ordenadaSup : number, abcissaInf : number, ordenadaInf, orientacao : string){
    if (this.props.coordenadasPassagem === undefined || this.props.coordenadasPassagem === null){
      this.props.coordenadasPassagem = [];
    }
    this.props.coordenadasPassagem.push(CoordenadasPassagem.create({id: id, abcissaSup: abcissaSup, ordenadaSup: ordenadaSup, abcissaInf : abcissaInf, ordenadaInf : ordenadaInf,orientacao: orientacao}).getValue());
  }

  public carregarCoordenadasSala(nome : string, abcissaA : number, ordenadaA : number, abcissaB : number, ordenadaB : number, abcissaPorta : number, ordenadaPorta : number, orientacaoPorta : string){
    if(this.props.coordenadasSala === undefined || this.props.coordenadasSala === null){
      this.props.coordenadasSala = [];
    }
    this.props.coordenadasSala.push(CoordenadasSala.create({nome: nome, abcissaA: abcissaA, ordenadaA: ordenadaA, abcissaB: abcissaB, ordenadaB: ordenadaB, abcissaPorta: abcissaPorta, ordenadaPorta: ordenadaPorta, orientacaoPorta: orientacaoPorta}).getValue());
  }

  private obterInformacaoPassagens() : any[]{
    let dados : any[] = [];
    if(!this.props.coordenadasPassagem){
      return null;
    }
    for(let passagem of this.props.coordenadasPassagem){
      dados.push({id: passagem.returnId(), abcissaA: passagem.returnAbcissaSup(), ordenadaA: passagem.returnOrdenadaSup(),
        abcissaB:passagem.returnAbcissaInf(), ordenadaB: passagem.returnOrdenadaInf(),orientacao: passagem.returnOrientacao()});
    }
    return dados;
  }

  private obterInformcaoElevador() : any{
    if(!this.props.coordenadasElevador){
      return null;
    }
    
    return {xCoord: this.props.coordenadasElevador.returnXCoord(), yCoord: this.props.coordenadasElevador.returnYCoord(),
       orientacao: this.props.coordenadasElevador.returnOrientacao()};
  }

  private obterInformacaoPortas() : any[]{
    let dados : any[] = [];
    if(!this.props.coordenadasSala){
      return null;
    }
    for(let sala of this.props.coordenadasSala){
      dados.push({abcissa: sala.returnAbcissaPorta(), ordenada: sala.returnOrdenadaPorta(), orientacao: sala.returnOrientacaoPorta()});
    }
    return dados;
  }

  public exportarMapa() : any {
    let mapa = {
      matriz : this.returnTipoDePontos(),
      passagens : this.obterInformacaoPassagens(),
      elevador : this.obterInformcaoElevador(),
      portas : this.obterInformacaoPortas(),
    }
    return mapa;
  }
}