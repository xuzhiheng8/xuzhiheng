function Mine(tr,td,mineNum){
    this.tr=tr;
    this.td=td;
    this.mineNum=mineNum;

    this.squares=[];
    this.tds=[];
    this.surplusMine=mineNum;
    this.allRight=false;

    this.parent=document.querySelector('.gameBox');
}


Mine.prototype.createDom=function(){
    let table=document.createElement('table');
    for(let i=0;i<this.tr;i++){
        let domTr=document.createElement('Tr');
        this.tds[i]=[];

        for(let j=0;j<this.td;j++){
            let domTd=document.createElement('td');

            this.tds[i][j]=domTd;

            domTr.appendChild(domTd);
        }
        table.appendChild(domTr);
    }
    this .parent.appendChild(table);







let mine=new Mine(28,28,99);
mine.createDom();
