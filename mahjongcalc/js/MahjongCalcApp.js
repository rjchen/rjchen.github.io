var app = angular.module("MahjongCalcApp",['ngCookies']);

app.controller("MahjongCalc",['$cookies',function($cookies){
   this.pointsHistory = [];
   this.labelHistory = [];
   this.totalPoints = [0, 0, 0, 0];
   this.labelPlayers=["P1","P2","P3","P4"];
   this.editPlayer = [false,false,false,false];
   
   this.winner = 0;
   this.loser = 0;
   this.cover = false;
   this.points = 5;
   this.rate = 0.25;
   
   this.selectedRow = null;
   
   this.showHistory = false;
   
   var self = this;
   
   loadCookie();
   
   function loadCookie() {
       var pointsStr = $cookies.get('pointsHistory');
       var labelsStr = $cookies.get('labelHistory');
       var playerStr = $cookies.get('labelPlayers');
       
       if ((pointsStr != undefined && labelsStr != undefined) && (pointsStr != "" && labelsStr != "")) {
           loadHistory();
       }

       if ((playerStr != undefined) && (playerStr != "")){
           loadPlayers();
       }
       
       function loadHistory() {
           var labelArr = labelsStr.split(",");
            var scoreArr = pointsStr.split(",");
            
            var labelArrRow;
            var scoreArrRow;
            var rowIndex;
            
            for (var i=0; i<labelArr.length; i++){
                var j = i%4;
                if (j==0) {
                    rowIndex = (i/4) - 1;
                    if (rowIndex >= 0) {
                        self.labelHistory.push(labelArrRow);
                        self.pointsHistory.push(scoreArrRow);
                    }
                    labelArrRow = [];
                    scoreArrRow = [];
                }    
                labelArrRow[j] = labelArr[i];
                var points = parseInt(scoreArr[i]);
                scoreArrRow[j] = points;   
                
                self.totalPoints[j] = self.totalPoints[j] + points;
            }
            self.labelHistory.push(labelArrRow);
            self.pointsHistory.push(scoreArrRow);

       }

       function loadPlayers(){
           self.labelPlayers = playerStr.split(",");
       }
   }
   
   function updateCookie() {
       
        var pointsStr = "";
        var labelsStr = "";
        
        for (var i=0; i<self.pointsHistory.length; i++){
            for (var j=0; j<4; j++) {
                if (pointsStr != "") {
                    pointsStr = pointsStr + "," + self.pointsHistory[i][j];
                    labelsStr = labelsStr + "," + self.labelHistory[i][j];
                }
                else {
                    pointsStr = self.pointsHistory[i][j];
                    labelsStr = self.labelHistory[i][j];
                }
            }
        }

        var playerStr = "";
        for (var i=0; i<self.labelPlayers.length; i++){
            if (playerStr != ""){
                playerStr = playerStr + "," + self.labelPlayers[i];
            }
            else {
                playerStr = self.labelPlayers[i];
            }
        }
        
        var d = new Date();
        d.setTime(d.getTime() + (365*24*60*60*1000)); // expires after 1 year
        var expires = "expires="+d.toUTCString();
        
        $cookies.put("pointsHistory",pointsStr,{'expires':expires});
        $cookies.put("labelHistory",labelsStr,{'expires':expires});
        $cookies.put("labelPlayers",playerStr,{'expires':expires});
        
   }
   
   this.recordScore = function() {
        var scorePoints = [];
        var scoreLabels = [];
        for (var i=0; i<4; i++) {
            if (i == this.winner) {
                if (this.winner == this.loser) {
                    // if self draw
                    scorePoints[i] = this.points*6;
                }
                else {
                    scorePoints[i] = this.points*4;
                }
                scoreLabels[i] = this.points;
            }
            else if (i == this.loser) {
                if (this.cover) {
                    scorePoints[i] = -this.points*4;
                    scoreLabels[i] = 'L*';
                }
                else {
                    scorePoints[i] = -this.points*2;
                    scoreLabels[i] = 'L';
                }
            }
            else {
                if (this.winner == this.loser) {
                    // if self draw
                    scorePoints[i] = -this.points*2;
                    scoreLabels[i] = 'L';
                }
                else if (this.cover){
                    scorePoints[i] = 0;
                    scoreLabels[i] = ' ';
                }
                else {
                    scorePoints[i] = -this.points;
                    scoreLabels[i] = ' ';
                }
                
            }
            this.totalPoints[i] = this.totalPoints[i] + scorePoints[i];
        }
        this.pointsHistory.push(scorePoints);
        this.labelHistory.push(scoreLabels);
        
        this.cover = false;
        
        updateCookie();
    }
    
    this.deleteRow = function() {
        if (this.selectedRow != null && this.selectedRow >= 0) {
            for (var i=0; i<4; i++) {
                this.totalPoints[i] = this.totalPoints[i] - this.pointsHistory[this.selectedRow][i];
            }
            
            this.pointsHistory.splice(this.selectedRow,1);
            this.labelHistory.splice(this.selectedRow,1);
            
            this.selectedRow = null;
        }
        
        this.cover = false;
        
        updateCookie();
    }

    this.editPlayerLabel = function(playerIndex){
        for (var i=0; i<self.editPlayer.length; i++){
            self.editPlayer[i] = false;
        }
        self.editPlayer[playerIndex] = true;
    }

    this.submitPlayerLabel = function(playerIndex){
        self.editPlayer[playerIndex] = false;
        updateCookie();
    }
    
    this.clear = function() {
        if (this.pointsHistory.length == 0){
            this.labelPlayers = ["P1","P2","P3","P4"];
        }
        this.pointsHistory = [];
        this.labelHistory = [];
        this.totalPoints = [0, 0, 0, 0];
        
        this.winner = 0;
        this.loser = 0;
        this.cover = false;
        this.points = 5;
        
        this.selectedRow = null;
        
        updateCookie();
    }
}]);

// DIRECTIVES

app.directive('autoFocus', function($timeout) {
    return {
        link: function (scope, element, attrs) {
            attrs.$observe("autoFocus", function(newValue){
                if (newValue === "true")
                    $timeout(function(){
                        element[0].focus();
                        element[0].setSelectionRange(0, element[0].value.length);
                    });
            });
        }
    };
});