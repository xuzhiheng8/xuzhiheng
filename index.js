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


Mine.prototype.updateNum = function() {
    for (let i = 0; i < this.tr; i++) {
        for (let j = 0; j < this.td; j++) {
           
            if (this.squares[i][j].type == 'number') {
                continue;
            }

            let num = this.getAround(this.squares[i][j]); 

            for (let k = 0; k < num.length; k++) {
                this.squares[num[k][0]][num[k][1]].value += 1;
            }
        }
    }
}


Mine.prototype.play = function(ev, obj) {
    let self = this;
    if (ev.which == 1 && obj.className != 'flag') { 

        let curSquare = this.squares[obj.pos[0]][obj.pos[1]];
        let cl = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']
        if (curSquare.type == 'number') {
          

            obj.innerHTML = curSquare.value;
            obj.className = cl[curSquare.value];

            if (curSquare.value == 0) {
          
                obj.innerHTML = ''; 
                function getAllZero(square) {
                    let around = self.getAround(square); 

                    for (let i = 0; i < around.length; i++) {
                        let x = around[i][0]; 
                        let y = around[i][1]; 

                        self.tds[x][y].className = cl[self.squares[x][y].value];

                        if (self.squares[x][y].value == 0) {
                          
                            if (!self.tds[x][y].check) {
                                self.tds[x][y].check = true;
                                getAllZero(self.squares[x][y]);
                            }
                        } else {
                      
                            self.tds[x][y].innerHTML = self.squares[x][y].value;
                        }
                    }
                }
                getAllZero(curSquare);
            }
        } else {
            this.gameOver(obj);
        }
    }
    if (ev.which == 3) {
   
        if (obj.className && obj.className != 'flag') {
            return;
        }
        obj.className = obj.className == 'flag' ? '' : 'flag';

        if (this.squares[obj.pos[0]][obj.pos[1]].type == 'mine') {
            this.allRight = true;
        } else {
            this.allRight = false;
        }
        if (obj.className == 'flag') {
            this.mineNumDom.innerHTML = --this.surplusMine;
        } else {
            this.mineNumDom.innerHTML = ++this.surplusMine;
        }
        if (this.surplusMine == 0) {
  
            if (this.allRight) {
                alert('恭喜你,游戏通过');
            } else {
                alert('恭喜你,游戏失败');
                this.gameOver();
            }
        }

    }
};


Mine.prototype.gameOver = function(clickTd) {

    for (let i = 0; i < this.tr; i++) {
        for (let j = 0; j < this.td; j++) {
            if (this.squares[i][j].type == 'mine') {
                this.tds[i][j].className = 'mine';
            }

            this.tds[i][j].onmousedown = null;
        }
    }

    if (clickTd) {
        clickTd.style.backgroundColor = '#f00';
    }


}

let btns = document.querySelectorAll('.level button');
let mine = null;
let ln = 0;
let arr = [
    [9, 9, 10],
    [16, 16, 40],
    [28, 28, 90]
];

for(let i =0; i < btns.length-1; i ++) {
    btns[i].onclick = function() {
        btns[ln].className = '';
        this.className = 'active';

        mine = new Mine(...arr[i]);
        mine.init();
        ln = i;
    }
}
btns[0].onclick();  
btns[3].onclick = function () {
    mine.init();
}
