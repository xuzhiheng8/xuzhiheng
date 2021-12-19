function Mine(tr, td, mineNum) {
    this.tr = tr; 
    this.td = td; 
    this.mineNum = mineNum; 

    this.squares = [];
    this.tds = []; 
    this.surplusMine = mineNum; 
    this.allRight = false; 

    this.parent = document.querySelector('.gameBox');


}


Mine.prototype.randomNum = function() {
    let square = new Array(this.tr * this.td), 
        len = square.length;
    for (let i = 0; i < square.length; i++) {
        square[i] = i;
    }
    square.sort(function() {
        return 0.5 - Math.random()
    });
    return square.slice(0, this.mineNum);
}
Mine.prototype.init = function() {
    let rn = this.randomNum(); 
    let n = 0; 
    for (let i = 0; i < this.tr; i++) {
        this.squares[i] = [];
        for (let j = 0; j < this.td; j++) {
        

            if (rn.indexOf(++n) != -1) {
              
                this.squares[i][j] = {
                    type: 'mine',
                    x: j,
                    y: i
                };
            } else {
                this.squares[i][j] = {
                    type: 'number',
                    x: j,
                    y: i,
                    value: 0
                };
            }
        }
    }


    this.updateNum();
    this.createDom();

    this.parent.oncontextmenu = function() {
        return false;
    }


    this.mineNumDom = document.querySelector('.mineNum');
    this.mineNumDom.innerHTML = this.surplusMine;

};


Mine.prototype.createDom = function() {
    let self = this;
    let table = document.createElement('table');

    for (let i = 0; i < this.tr; i++) { 
        let domTr = document.createElement('tr');
        this.tds[i] = [];

        for (let j = 0; j < this.td; j++) {
            let domTd = document.createElement('td');

            domTd.pos = [i, j]; 
            domTd.onmousedown = function(event) {
                self.play(event, this); 
            };

            this.tds[i][j] = domTd; 

         


            domTr.appendChild(domTd);
        }
        table.appendChild(domTr);
    }
    this.parent.innerHTML = '';
    this.parent.appendChild(table);
};


Mine.prototype.getAround = function(square) {
    let x = square.x;
    let y = square.y;
    let result = []; 



    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (
                i < 0 || 
                j < 0 || 
                i > this.td - 1 || 
                j > this.tr - 1 || 
                (i == x && j == y) || 
                this.squares[j][i].type == 'mine' 
            ) {
                continue;
            }

            result.push([j, i]); 
        }
    }
    return result;
};
