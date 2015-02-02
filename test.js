//http://www.ovidhan.org/b2b/%E0%A6%9A%E0%A6%BE%E0%A6%AA

$.getJSON("js/data/test.json").done(function(res){
    var id=0;

    words = _.chain(res)
    .map(function(meaning, word){
        console.log('started '+word);

        var startDate = new Date();
        var totalCommas = meaning.match(/,/g).length;
        console.log('commas '+totalCommas);

        //fix ,,,, problem
        _.times(totalCommas, function(){
            meaning = meaning.replace(",,", ",\"\",");
        });

        //fix [, problem
        meaning = meaning.replace("[,", "[\"\",");

        meaning = JSON.parse(meaning);

        var endDate = new Date();
        var timeTook = endDate - startDate ;
        console.log("completed "+word + " in "+ timeTook + " mili seconds");

        return meaning.name = word, meaning.id=id++, meaning;
    }).toArray().value();
});

function gtGen(word){
    return "https://translate.google.com/translate_a/single"+
           "?client=t&sl=en&tl=bn&hl=en&dt=bd&dt=ex&dt=ld&dt=md"+
           "&dt=qc&dt=rw&dt=rm&dt=ss&dt=t&dt=at&dt=sw"+
           "&ie=UTF-8&oe=UTF-8&otf=1&rom=1&ssel=3&tsel=0&q="+word;
}

function processResponse(res, word){
    data[word] = res;
    console.log(word+" scrapped");
}

function scrap(word){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", gtGen(word), true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        processResponse(xhr.responseText, word);
      }
    };
    xhr.send();
}

console.save = function(data, filename){

    if(!data) {
        console.error('Console.save: No data');
        return;
    }

    if(!filename) filename = 'console.json';

    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, 4);
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a');

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
 };

var data = {};
var i=words.length-1;
var si = setInterval(function(){scrap(words[i--]); if(i<0) clearInterval(si);}, 1000);