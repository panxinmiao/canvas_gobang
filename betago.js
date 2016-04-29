
var FIVECHESS = FIVECHESS||{};

FIVECHESS.fivechess =  function(){
    FIVECHESS.RUNNING = true;
    var body = document.getElementsByTagName('body')[0];
    body.style.overflowY = 'hidden';
    //document.getElementById('container').style.display='block';
    var container = document.createElement('div');
    //var canvas = document.getElementById('canvas');
    container.style.backgroundColor = '#ddd';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.left = 0;
    container.style.top = 0;
    container.style.filter = 'alpha(opacity=50)';
    container.style.opacity = '0.5';
    container.style.position = 'fixed';
    container.style.zIndex = 1050;
    var canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    body.appendChild(container);
    container.appendChild(canvas);

    var context = canvas.getContext('2d');
    
    var MARGIN = 30;
    var INTERVAL = 30;
    
    var BLACK_CHESS = -1;
    var WHITE_CHESS = 1;
    var NO_CHESS = 0;
    var WIN_STATE = [];
    var BLACK_TURN = 1;
    var WHITE_TURN = 2;
    
    var pointer;
    var chessState =[];
    
    var turn = BLACK_TURN;
    
    var lastAIDrop;
    
    var winPoints;
    
    var gameOver = false;
    
    var ai;
    
    /*
     * 初始化WIN_STATE,共572种
     */
    (function(){
        var n = 0;
        for(var i=0;i<15;i++){
            for(var j=0;j<11;j++){
                WIN_STATE[n]=[];
                for(var m=0;m<5;m++){
                    WIN_STATE[n].push({
                        x: i,
                        y: j+m
                    });
                    
                }
                n++;
            }
        }
        for(var i=0;i<15;i++){
            for(var j=0;j<11;j++){
                WIN_STATE[n]=[];
                for(var m=0;m<5;m++){
                    WIN_STATE[n].push({
                        x: j+m,
                        y: i
                    });
                }
                n++;
            }
        }
        for(var i=0;i<11;i++){
            for(var j=0;j<11;j++){
                WIN_STATE[n]=[];
                for(var m=0;m<5;m++){
                    WIN_STATE[n].push({
                        x: i+m,
                        y: j+m
                    });
                }
                n++;
            }
        }
        for(var i=0;i<11;i++){
            for(var j=0;j<11;j++){
                WIN_STATE[n]=[];
                for(var m=0;m<5;m++){
                    WIN_STATE[n].push({
                        x: i+4-m,
                        y: j+m
                    });
                }
                n++;
            }
        }
    })();
    

        
    function drawPanel(){
        context.save();
        context.lineWidth=0.5;
        context.strokeStyle = 'black';
        for(var i=0;i<15;i++){
            context.beginPath();
            context.moveTo(MARGIN+INTERVAL*i,MARGIN);
            context.lineTo(MARGIN+INTERVAL*i,MARGIN+INTERVAL*14);
            context.stroke();
            
            context.beginPath();
            context.moveTo(MARGIN,MARGIN+INTERVAL*i);
            context.lineTo(MARGIN+INTERVAL*14,MARGIN+INTERVAL*i);
            context.stroke();
        }
        
        context.restore();
    }
    
    function repaint(){
        context.clearRect(0, 0, 500, 500);
        drawPanel();
        drawPointer();
        drawChess();
        drawWinChess();
        drawLastDrop();
    }
    
    function drawPointer(){
        if(pointer){
            context.save();
            context.lineWidth=0.5;
            context.strokeStyle = 'red';
            drawPointerLine(pointer, -12, -12, -6, -12);
            drawPointerLine(pointer, -12, -12, -12, -6);
            drawPointerLine(pointer, -12, 12, -12, 6);
            drawPointerLine(pointer, -12, 12, -6, 12);
            drawPointerLine(pointer, 12, -12, 6, -12);
            drawPointerLine(pointer, 12, -12, 12, -6);
            drawPointerLine(pointer, 12, 12, 6, 12);
            drawPointerLine(pointer, 12, 12, 12, 6);
            context.restore();
        }
        function drawPointerLine(pointer, a, b, c, d){
            context.beginPath();
            context.moveTo(pointer.x*INTERVAL+MARGIN + a, pointer.y*INTERVAL+MARGIN + b);
            context.lineTo(pointer.x*INTERVAL+MARGIN + c, pointer.y*INTERVAL+MARGIN + d);
            context.stroke();
        }
    }
    
    function drawChess(){
        context.save();
        for(var i=0;i<15;i++){
            for(var j=0;j<15;j++){
                if(chessState[i][j]==WHITE_CHESS){
                    context.strokeStyle = 'black';
                    context.fillStyle = 'white';
                    context.beginPath();
                    context.arc(i*INTERVAL+MARGIN,j*INTERVAL+MARGIN,12,0,Math.PI*2,false);
                    context.stroke();
                    context.fill();
                }
                if(chessState[i][j]==BLACK_CHESS){
                    context.strokeStyle = 'black';
                    context.fillStyle = 'black';
                    context.beginPath();
                    context.arc(i*INTERVAL+MARGIN,j*INTERVAL+MARGIN,12,0,Math.PI*2,false);
                    context.stroke();
                    context.fill();
                }
            }
        }
        context.restore();
    }
    
    function drawLastDrop(){
        if(lastAIDrop){
            context.save();
            context.strokeStyle = 'black';
            context.beginPath();
            context.moveTo(lastAIDrop.x*INTERVAL+MARGIN - 4 , lastAIDrop.y*INTERVAL+MARGIN);
            context.lineTo(lastAIDrop.x*INTERVAL+MARGIN + 4 , lastAIDrop.y*INTERVAL+MARGIN);
            context.stroke();
            
            context.beginPath();
            context.moveTo(lastAIDrop.x*INTERVAL+MARGIN , lastAIDrop.y*INTERVAL+MARGIN - 4);
            context.lineTo(lastAIDrop.x*INTERVAL+MARGIN , lastAIDrop.y*INTERVAL+MARGIN + 4);
            context.stroke();
            
            context.restore();
        }
    }
    
    function drawWinChess(){
        if(winPoints){
            context.save();
            context.strokeStyle = 'black';
            context.fillStyle = 'yellow';
            for(var p of winPoints){
                context.beginPath();
                context.arc(p.x*INTERVAL+MARGIN,p.y*INTERVAL+MARGIN,12,0,Math.PI*2,false);
                context.stroke();
                context.fill();
            }
            context.restore();
        }
    }
    
    function playerDrop(x, y){
        chessState[x][y] = BLACK_CHESS;
        ai.playerDrop(x,y);
        checkOver();
        repaint();
        turn = WHITE_TURN;
        if(!gameOver){
            var p = ai.getBestPoint();
            aiDrop(p.x, p.y);
        }
    }
    
    function aiDrop(x, y){
        chessState[x][y] = WHITE_CHESS;
        ai.aiDrop(x,y);
        lastAIDrop = {
                x: x,
                y: y
            };
        checkOver();
        repaint();
        turn = BLACK_TURN;
    }
    
    function checkOver(){
        for(var points of WIN_STATE){
            var sum=0;
            for(var p of points){
                sum += chessState[p.x][p.y];
            }
            
            if(sum == 5 || sum == -5){
                winPoints = points;
                gameOver = true;
            }
        }
    }
    
    function FiveChessAI(chessState){
        this.pWinFlag = [];
        this.cWinFlag = [];
        this.chessState = chessState;
        
        for (var i=0; i<572; i++){
            this.pWinFlag[i] = true;
            this.cWinFlag[i] = true;
        }
        
        function isContains(ary, x, y){
            for(var i=0; i<ary.length; i++){
                if(ary[i].x == x && ary[i].y == y){
                    return true;
                }
            }
            return false;
        }
        
        for(var i=0; i<15; i++){
            for(var j=0; j<15; j++){
                if(chessState[i][j] != NO_CHESS){
                    for(var n=0; n<572; n++){
                        if(isContains(WIN_STATE[n], i, j)){
                            this.pWinFlag[n] = (chessState[i][j]==BLACK_CHESS);
                            this.cWinFlag[n] = (chessState[i][j]==WHITE_CHESS);
                        }
                    }
                }
            }
        }
        
        this.aiDrop = function(x,y){
            for(var n=0;n<572;n++){
                if(isContains(WIN_STATE[n], x, y)){
                    this.pWinFlag[n]=false;
                }
            }
        }
        
        this.playerDrop = function(x,y){
            for(var n=0;n<572;n++){
                if(isContains(WIN_STATE[n], x, y)){
                    this.cWinFlag[n]=false;
                }
            }
        }
        
        function newArray(m,n, value){
            var ary = [];
            for(var i=0; i<m; i++){
                ary[i] = [];
                for(var j=0;j<n;j++){
                    ary[i][j]=value;
                }
            }
            return ary;
        }
        
        this.getBestPoint = function(){
            
            var cScr = newArray(15,15,0);
            var pScr = newArray(15,15,0);
            var cWinPoints;
            var pWinPoints;
            for(var i=0; i<572; i++){
                if(!cWinPoints && this.cWinFlag[i]){
                    var oep = getOpenEndPoint(i, WHITE_CHESS);
                    cWinPoints = getScore(i, WHITE_CHESS, oep, cScr);
                }
                
                if(!pWinPoints && this.pWinFlag[i]){
                    var oep = getOpenEndPoint(i, BLACK_CHESS);
                    pWinPoints = getScore(i, BLACK_CHESS, oep, pScr);
                }
            }
            
            if(cWinPoints){
                return cWinPoints;
            }
            if(pWinPoints){
                return pWinPoints;
            }
            
            var cMax = getMaxScr(cScr);
            var pMax = getMaxScr(pScr);
            if(cMax.score>pMax.score){
                return {
                    x: cMax.x,
                    y: cMax.y
                }
            }else{
                return {
                    x: pMax.x,
                    y: pMax.y
                }
            }
        }
        
        function getMaxScr(score){
            var maxScr = 0;
            var maxX = 0;
            var maxY = 0;
            for(var i=0;i<15;i++){
                for(var j=0;j<15;j++){
                    if(score[i][j]>maxScr){
                        maxScr=score[i][j];
                        maxX=i;
                        maxY=j;
                    }
                }
            }
            return {
                x: maxX,
                y: maxY,
                score: maxScr
            }
        }
        
        function getScore(i, chess, oep, score){
            var ct=0;
            
            for(var p of WIN_STATE[i]){
                if(chessState[p.x][p.y] == chess){
                    ct++;
                }
                if(chessState[p.x][p.y]== NO_CHESS){
                    for(var p1 of WIN_STATE[i]){
                        if(chessState[p1.x][p1.y]==chess){
                            score[p.x][p.y]+=oep;
                        }
                    }
                }
            }
            for(var m=0;m<15;m++){
                for(var n=0;n<15;n++){
                    if(isContains(WIN_STATE[i], m, n) && (chessState[m][n]==NO_CHESS)){
                        switch(ct){
                        /*case 1:
                            score[m][n]+= oep;
                            break;*/
                        case 2:
                            score[m][n]+=(3+Math.pow(2, oep)+chess);
                            break;
                        case 3:
                            score[m][n]+=(12.5+Math.pow(6, oep)+2.5*chess);
                            break;
                        case 4:
                            return {
                              x: m,
                              y: n
                            }
                        }
                        //console.log('score['+m+','+n+']:'+score[m][n]);
                    }
                }
            }

        }
        
        
        function getOpenEndPoint(i, chess){
            var oep=0;
            if(i<165){
                if(WIN_STATE[i][0].y>0&&chessState[WIN_STATE[i][0].x][WIN_STATE[i][0].y-1] != -chess){
                    oep++;
                }
                if(WIN_STATE[i][4].y<14&&chessState[WIN_STATE[i][4].x][WIN_STATE[i][4].y+1] != -chess){
                    oep++;
                }
            }else if(i>=165&&i<330){
                if(WIN_STATE[i][0].x>0&&chessState[WIN_STATE[i][0].x-1][WIN_STATE[i][0].y] != -chess){
                    oep++;
                }
                if(WIN_STATE[i][4].x<14&&chessState[WIN_STATE[i][4].x+1][WIN_STATE[i][4].y] != -chess){
                    oep++;
                }
            }else if(i>=330&&i<451){
                if(WIN_STATE[i][0].x>0&&WIN_STATE[i][0].y>0&&chessState[WIN_STATE[i][0].x-1][WIN_STATE[i][0].y-1]!= -chess){
                    oep++;
                }
                if(WIN_STATE[i][4].x<14&&WIN_STATE[i][4].y<14&&chessState[WIN_STATE[i][4].x+1][WIN_STATE[i][4].y+1]!= -chess){
                    oep++;
                }
            }else if(i>=451&&i<572){
                if(WIN_STATE[i][0].x<14&&WIN_STATE[i][0].y>0&&chessState[WIN_STATE[i][0].x+1][WIN_STATE[i][0].y-1]!= -chess){
                    oep++;
                }
                if(WIN_STATE[i][4].x>0&&WIN_STATE[i][4].y<14&&chessState[WIN_STATE[i][4].x-1][WIN_STATE[i][4].y+1]!= -chess){
                    oep++;
                }
            }
            return oep;
        }
        
    }
    
    function start(){
        var w = window.innerWidth;
        var h = window.innerHeight;
        context.save();
        context.clearRect(0, 0, w, h);
        context.textAlign='center';
        context.textBaseline='middle';
        context.fillStyle='blue';
        context.strokeStyle='yellow';
        context.font='68px impact';
        context.shadowColor='rgba(0,0,0,0.8)';
        context.shadowOffsetX=5;
        context.shadowOffsetY=5;
        context.shadowBlur=10;
        var text = "PanXinmiao Presents";
        context.fillText(text,w/2,h/5);
        context.strokeText(text,w/2,h/5);
        context.fillStyle='orange';
        context.strokeStyle='green';
        text = "Have Fun";
        context.fillText(text,w/2,2*h/5);
        context.strokeText(text,w/2,2*h/5);
        
        context.fillStyle='black';
        context.font='20px sans-serif';
        context.fillText("press any key to continue",w/2,2*h/3);
        context.restore();
        //context.strokeText(text,canvas.width/2,canvas.height/2);
        
        var pressAnyKeyListener = function(e){
            e.preventDefault();
            document.removeEventListener('keydown',pressAnyKeyListener);
            resetGame();
        }
        document.addEventListener('keydown', pressAnyKeyListener);
    }
    
    function resetGame(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        var offsetX = canvas.width/2-500/2;
        var offsetY = canvas.height/2-500/2;
        
        context.translate(offsetX, offsetY);
        
        for(var i=0; i<15; i++){
            chessState[i] = [];
            for(var j=0; j<15; j++){
                chessState[i][j] = NO_CHESS;
            }
        }
        //chessState[0][0] = WHITE_CHESS;
        ai = new FiveChessAI(chessState);
        
        canvas.addEventListener('mousemove', function(e){
            var x=Math.round((e.x-MARGIN-offsetX)/INTERVAL);
            var y=Math.round((e.y-MARGIN-offsetY)/INTERVAL);
            if(!pointer || (x != pointer.x || y != pointer.y)){
                if(x>=0 && x<15 && y>=0 && y< 15){
                    if(chessState[x][y] == NO_CHESS){
                        pointer = {
                                x: x,
                                y: y
                        }
                        canvas.style.cursor = 'pointer';
                    }else{
                        canvas.style.cursor = 'no-drop';
                        pointer = null;
                    }
                }else{
                    canvas.style.cursor = 'default';
                    pointer = null;
                }
                repaint();
            }
        });
        
        canvas.addEventListener('mousedown', function(e){
            var x=Math.round((e.x-MARGIN-offsetX)/INTERVAL);
            var y=Math.round((e.y-MARGIN-offsetY)/INTERVAL);
            if(!gameOver && turn == BLACK_TURN && x>=0 && x<15 && y>=0 && y< 15 && chessState[x][y] == NO_CHESS){
                playerDrop(x,y);
                canvas.style.cursor = 'no-drop';
                pointer = null;
            }
        });
        
        
        repaint();
    }
    
    start();
}

FIVECHESS.keyStatck = [];
document.addEventListener('keydown',function(e){
    if(FIVECHESS.RUNNING){
        return;
    }
    if(e.altKey && e.ctrlKey && e.keyCode >= 37 && e.keyCode <= 40){
        FIVECHESS.keyStatck.push(e.keyCode);
        if(FIVECHESS.keyStatck.length>8){
            FIVECHESS.keyStatck.shift();
        }
        if(FIVECHESS.keyStatck.join() == '38,40,37,39,38,40,37,39'){
            console.log('Bingo!~~~~~~');
            console.log('%cPanXinmiao presents, have fun and enjoy it!', "color:blue");
            FIVECHESS.fivechess();
        }
        e.preventDefault();
    }else{
        FIVECHESS.keyStatck = [];
    }
});


