(function(window){
    //I recommend this
    'use strict';
    function define_library(){
        var MahjongCalc = {};
        
        var scoreHistory = [];
        var scoreLabelHistory = [];
        
        MahjongCalc.reset = function(){
            scoreHistory = [];
            scoreLabelHistory = [];
        }
        
        MahjongCalc.removeScoreAtIndex = function(index, callback) {
            scoreHistory.splice(index,1);
            scoreLabelHistory.splice(index,1);
            callback();
        }
        
        MahjongCalc.recordScore = function(winner, loser, points, cover, callback) {
            var scorePoints = [];
            var scoreLabels = [];
            for (var i=0; i<4; i++) {
                if (i == winner) {
                    if (winner == loser) {
                        scorePoints[i] = points*6;
                    }
                    else {
                        scorePoints[i] = points*4;
                    }
                    scoreLabels[i] = points;
                }
                else if (i == loser) {
                    if (cover) {
                        scorePoints[i] = -points*4;
                        scoreLabels[i] = 'L*';
                    }
                    else {
                        scorePoints[i] = -points*2;
                        scoreLabels[i] = 'L';
                    }
                }
                else {
                    if (winner == loser) {
                        // if self draw
                        scorePoints[i] = -points*2;
                        scoreLabels[i] = 'L';
                    }
                    else if (cover){
                        scorePoints[i] = 0;
                        scoreLabels[i] = ' ';
                    }
                    else {
                        scorePoints[i] = -points;
                        scoreLabels[i] = ' ';
                    }
                    
                }
            }
            scoreHistory.push(scorePoints);
            scoreLabelHistory.push(scoreLabels);
            callback();
        }
        
        MahjongCalc.getLast = function(){
            return scoreLabelHistory[scoreLabelHistory.length - 1];
        }   
        
        MahjongCalc.getHistory = function(){
            return scoreLabelHistory;
        }
        
        MahjongCalc.loadSerialHistory = function(labelStr,scoreStr){
            var labelArr = labelStr.split(",");
            var scoreArr = scoreStr.split(",");
            
            var labelArrRow;
            var scoreArrRow;
            var rowIndex;
            
            for (var i=0; i<labelArr.length; i++){
                var j = i%4;
                if (j==0) {
                    rowIndex = (i/4) - 1;
                    if (rowIndex >= 0) {
                        scoreLabelHistory.push(labelArrRow);
                        scoreHistory.push(scoreArrRow);
                    }
                    labelArrRow = [];
                    scoreArrRow = [];
                }    
                labelArrRow[j] = labelArr[i];
                scoreArrRow[j] = parseInt(scoreArr[i]);   
            }
            scoreLabelHistory.push(labelArrRow);
            scoreHistory.push(scoreArrRow);
            
        }
        
        MahjongCalc.getSerialLabelHistory = function(){
            var serialStr = "";
            for (var i=0; i<scoreLabelHistory.length; i++){
                for (var j=0; j<4; j++) {
                    if (serialStr != "") {
                        serialStr = serialStr + "," + scoreLabelHistory[i][j];
                    }
                    else {
                        serialStr = scoreLabelHistory[i][j];
                    }
                }
            }
            return serialStr;
        }
        
        MahjongCalc.getSerialHistory = function(){
            var serialStr = "";
            for (var i=0; i<scoreHistory.length; i++){
                for (var j=0; j<4; j++) {
                    if (serialStr != "") {
                        serialStr = serialStr + "," + scoreHistory[i][j];
                    }
                    else {
                        serialStr = scoreHistory[i][j];
                    }
                }
            }
            return serialStr;
        }
        
        MahjongCalc.getScores = function(){
            var totalScore = [0, 0, 0, 0];
            for (var i=0; i<scoreHistory.length; i++){
                for (var j=0; j<4; j++) {
                    totalScore[j] = totalScore[j] + scoreHistory[i][j];
                }
            }
            return totalScore;
        }
        
        MahjongCalc.greet = function(){
            alert("Hello from the " + name + " library.");
        }
        return MahjongCalc;
    }
    //define globally if it doesn't already exist
    if(typeof(MahjongCalc) === 'undefined'){
        window.MahjongCalc = define_library();
    }
    else{
        console.log("Library already defined.");
    }
})(window);