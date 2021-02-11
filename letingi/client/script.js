/*
Smá documentation:
Ef þú vilt bæta við fonti, þarftu að setja það sem font-face í css fileinn og svo setja nafnið á réttann hátt í
addFont fallið, svo þarf auðvitað að bæta til því í addDownloads fallið


Á eftir að laga hvernig textarea resize-ar, btw ég þoli ekki css
Þ.e. hvernig textarea stækkar og minnar þegar skrifað er það mikið að boxið stækkar

*/

//utaf vefhysing er ekki med ANAME eða ALIAS....
/*
if(window.location.href !== "http://www.letingi.is/" && window.location.href !== "http://localhost:8000/" && window.location.href !== "localhost:8000"){
	window.location = "http://www.letingi.is/";
} 
*/

// set lang of body to same as html, there is 100% a better way to do this
let html = document.getElementsByTagName("html");
let body = document.getElementsByTagName("body");
let lang = html[0].lang;
body[0].classList.add(lang);
let enFlags = document.getElementsByClassName("en-flag")

for(var i =0; i<enFlags.length; i++){
    enFlags[i].addEventListener("click", () => { 
        html[0].lang = "en";
        body[0].classList.remove("is");
        body[0].classList.add("en");
    });
}

let isFlags = document.getElementsByClassName("is-flag")
for(var i =0; i<isFlags.length; i++){
    isFlags[i].addEventListener("click", () => {
        html[0].lang = "is";
        body[0].classList.remove("en");
        body[0].classList.add("is");
    });
}




var baseImage, ctx, colors;
var infoIcon = document.getElementById("info-icon");
var buyIcon = document.getElementById("buy-icon");
var instagramIcon = document.getElementById("instagram-icon");
var buyPanel = document.getElementById("buy-panel");
var infoPanel = document.getElementById("info-panel");
var container = document.getElementById("container");
var infoBar = document.getElementById("info-bar");
var dlBtn = document.getElementById("download-fonts");
var downloadable = [];
var closeBtn = document.getElementsByClassName("close-btn");



var invertStyle = document.createElement('style');

invertStyle.id = "icon-invert";


addFont("Amma Grotesk","AmmaGrotesk",["Regular", "Bold"]);
addFont("Bogus", "Bogus", ["Regular"]);
addFont("Sebra", "Sebra", ["Regular"]);
addLitastika();

//fontin sem hægt er að dl-a
//titles, names, extensions
addDownloads(["Amma Grotesk", "Bogus", "Sebra"], ["AmmaGrotesk", "Bogus", "Sebra"], ["-Regular.woff","-Regular.otf", "-Regular.woff"]);//name of fonts followed by extensions.

//skrifar út letingi í textarea
window.setTimeout(writeLeting, 500);



dlBtn.addEventListener("click", (event) => {
    event.preventDefault();
    for(var i=0; i<downloadable.length; i++){
        //eina leidin til ad fa thetta til ad virka...
        var che = document.getElementById(downloadable[i].name + "checkbox");
        if(che.checked){
            var url =  "fonts/"+ downloadable[i].name;
            dlFile(url)
            // window.open(url);
        }
    }
    return false;
});

//fall sem lætur userinn dl-a mörgum hlutum í einu
function dlFile(url){
    
    console.log(url)
	//do nothing for now........
	return
    var iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.style.display = "none";
    document.body.appendChild(iframe);
}

buyIcon.addEventListener("click", () => {
    closePanel();
    buyPanel.style.display = "block";
});

infoIcon.addEventListener("click", () => {
    closePanel();
    infoPanel.style.display = "block";
});

infoPanel.addEventListener("click", () => {
// closePanel();
});

container.addEventListener("click", () => {
    closePanel();
});

instagramIcon.addEventListener("click", () => {
    window.open("https://www.instagram.com/letingi.otf/");
});


window.addEventListener("resize", windowResize);


//stilla nav barið og lita stikuna
function windowResize(){
        if(window.innerWidth <= 800){
            colors.width = window.innerWidth;
            colors.style.width = "100%";
            ctx.drawImage(baseImage, 0, 0, baseImage.width, baseImage.height, 0, 0, colors.width, colors.height);
            infoBar.style.height = "180px";
            container.style.marginTop = "210px";
        } else {
            colors.width = 400;
            colors.style.width = "400px";
            ctx.drawImage(baseImage, 0, 0, baseImage.width, baseImage.height, 0, 0, colors.width, colors.height);
            container.style.marginTop = "120px";
            infoBar.style.height = "90px";
        }
}

function addDownloads(titles, fonts, ext){
    var buyCheckboxes = document.getElementById("buy-checkboxes");
    for(var i=0; i<fonts.length; i++){
        var div = document.createElement("div");
        var checkbox = document.createElement("input");


        checkbox.type = "checkbox";
        checkbox.setAttribute("name", fonts[i] + ext[i]);
        checkbox.setAttribute("id", fonts[i] + ext[i] + "checkbox");
        checkbox.classList.add("checkbox-download")
        var label = document.createElement("label");
        label.appendChild(checkbox);
        label.innerHTML += titles[i];

        div.appendChild(label);
        // div.innerHTML += fonts[i];
        buyCheckboxes.appendChild(div);

        downloadable.push(checkbox);
    }
}

var stopList = ["A","Á","Ä","Å","B","C","D","Ð","E","É","F","G","H","I","Í","J","K","L","M","N","O","Ó","P","Q","R","S","T","U","Ú","Ü","V","W","X","Y","Ý","Ÿ","Z","Ź","Þ","Æ","Ö","Ø","a","á","ä","å","b","c","d","ð","e","é","f","g","h","ı","i","í","j","k","l","m","n","o","ó","p","q","r","s","t","u","ú","v","w","x","y","ý","ÿ","z","ß","þ","æ","ö","ø","&","!","?","@","$","%","1","2","3","4","5","6","7","8","9","0","*","/",".",",",":",";","„","“","#","_","-","–","—"," ","'", '"',"\n", "\t"]

//just close both things

for(var i=0; i<closeBtn.length; i++){
    closeBtn[i].addEventListener("click", closePanel);
}



//held að þessi aðferð sé notuð af öðru en loka hnappinum líka..
function closePanel(){
    buyPanel.style.display = "none";
    infoPanel.style.display = "none";
}

function addFont(title, name, fontTypes){
    var fontDiv = document.createElement("div");
    fontDiv.classList.add("font-div");
    var fontTextarea = document.createElement("textarea");
    fontTextarea.classList.add("font");

    fontTextarea.value = ":L";
    fontTextarea.style.fontFamily = name + "-Regular";
    fontTextarea.setAttribute("spellcheck", false);

    var initHeight = 84;
    fontTextarea.style.height = initHeight + "px";
    // fontTextarea.style.height = fontTextarea.scrollHeight + "px";

    
    fontDiv.style.height = initHeight + 120 + "px";

    fontTextarea.addEventListener("input", (e) => {

        var isInStopList = false;
        for(var i=0; i<stopList.length; i++){
            if(e.target.value.substring(e.target.value.length-1,e.target.value.length).toLowerCase() === stopList[i].toLowerCase()){
                 isInStopList = true;
                break;
            }
        }
        if(!isInStopList){
            e.target.value = e.target.value.substring(0,e.target.value.length-1) + ":L"
        }

        
       //veit ekki hvort thad seu enn bugs..
    //Þetta automatic scroll er vel buggað
    //todo: laga öll þessi bugs
        // console.log(e.target.style.height)
        var parHei = e.target.parentNode.style.height.substring(0,e.target.parentNode.style.height.length-2);
        // console.log(parHei)
        e.target.style.height = "";
        e.target.style.height = e.target.scrollHeight + "px";

        e.target.parentNode.style.height = "";
        e.target.parentNode.style.height = e.target.scrollHeight + 120 + "px";
    });


    var weightPickerDiv = document.createElement("div");
    weightPickerDiv.classList.add("weigth-div");

    var dropDown = document.createElement("select");
    dropDown.classList.add("weight-picker");
    for(var i=0; i<fontTypes.length; i++){
        var opt = document.createElement("option");
        opt.value = name + "-" +fontTypes[i];
        opt.innerHTML = fontTypes[i];
        dropDown.appendChild(opt);
    }
    dropDown.addEventListener("click", changeFontType);
    var fontInfo = document.createElement("span");

    fontInfo.innerHTML = title;
    fontInfo.classList.add("font-info");

    var minus = document.createElement("span");
    minus.innerHTML = "—"

    weightPickerDiv.appendChild(fontInfo);
    weightPickerDiv.appendChild(minus);
    weightPickerDiv.appendChild(dropDown);

    fontDiv.appendChild(fontTextarea);
    fontDiv.appendChild(weightPickerDiv);
    container.appendChild(fontDiv);


}


function isOverflown(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}


function writeLeting(e){
    var fonts = document.getElementsByClassName("font");
    var leti = ":Letingi";
    for(var i=0;i<fonts.length; i++){
        var n = parseInt(fonts[i].value.length);
        fonts[i].value += leti.substring(n, n+1);
    }
    if(fonts[0].value !== leti){
        window.setTimeout(writeLeting, 50);
    }

}


function changeFontType(e){
    var fontDiv = e.target.parentNode.parentNode;
    var children = fontDiv.childNodes;
    var font = children[0];
    font.style.fontFamily = e.target.value;
}


function addLitastika(){
    colors = document.getElementById("colors");
    ctx = colors.getContext("2d");
    ctx.id = "colors-ctx";
    baseImage = new Image();
    baseImage.src = "images/Lita_stika_svart.png";

    baseImage.onload = () => {
        windowResize(); //set image to correct width with this function
        // colors.addEventListener("click", getColor);
        colors.addEventListener("mousemove", getColor);
        colors.addEventListener("touchmove",getColor);
    }
}


//var ehv vesen ad breyta width a thessu en windowResize ætti að gera það rétt
function getColor(e){

    

    var x = event.layerX;
      var y = event.layerY;
      var pixel = ctx.getImageData(x, y, 1, 1);
      var data = pixel.data;
      var rgba = 'rgba(' + data[0] + ', ' + data[1] +
                 ', ' + data[2] + ', ' + (data[3] / 255) + ')';
      // color.style.background =  rgba;
      // color.textContent = rgba;
      console.log(rgba)
      var fonts = document.getElementsByClassName("font");
      for(var i=0; i<fonts.length; i++){
            fonts[i].style.color = rgba;
      }
}


//inversa allri síðunni
var backgroundWhite = true;
function inverse(){
    var body = document.getElementsByTagName("BODY")[0];
    var fontsDiv = document.getElementsByClassName("font-div");
    var fonts = document.getElementsByClassName("font");
    var infoBar = document.getElementById("info-bar");

    let infoPanels = document.getElementsByClassName("pop-up-panel");


    if(backgroundWhite){
        //set background black/invert
        //baeta vid media query thannig thetta virki bara fyrir stora skjai
        var css = `.icon:hover{filter:blur(2px) invert(100%);}
        .icon{filter:blur(0px) invert(100%)}
        `

        //turn on invert
        invertElement(body, true);

        
        if (invertStyle.styleSheet) {
            invertStyle.styleSheet.cssText = css;
        } else {
            invertStyle.appendChild(document.createTextNode(css));
        }
        document.getElementsByTagName('head')[0].appendChild(invertStyle);

 

        backgroundWhite = false;
        baseImage.src = "images/Lita_stika_hvitt.png";
        for(var i=0;i<fonts.length;i++){
            fonts[i].style.color = "white";
        }

        for(let i=0;i<infoPanels.length; i++){
            infoPanels[i].classList.add('pop-up-panel-invert')
        }

        for(let i=0;i<infoPanels.length; i++){
            closeBtn[i].classList.add('close-btn-invert')
        }


    } else {
        //set background white/deinvert
        var css = `.icon:hover{filter:blur(2px) invert(0%);}
        .icon{filter:blur(0px) invert(0%)}
        `

        if(invertStyle.styleSheet){
            invertStyle.childNodes = [];
        }

        if (invertStyle.styleSheet) {
            invertStyle.styleSheet.cssText = css;
        } else {
            invertStyle.appendChild(document.createTextNode(css));
        }
        document.getElementsByTagName('head')[0].appendChild(invertStyle);


        invertElement(body,false);
        baseImage.src = "images/Lita_stika_svart.png";
        backgroundWhite = true;
        for(var i=0; i<fonts.length; i++){
            fonts[i].style.color = "black";
        }


        for(let i=0;i<infoPanels.length; i++){
            infoPanels[i].classList.remove('pop-up-panel-invert')
        }

        for(let i=0;i<infoPanels.length; i++){
            closeBtn[i].classList.remove('close-btn-invert')
        }
    }
}



function invertElement(el, bool){
    if(bool){
        el.classList.add('invert-on');
        el.classList.remove("invert-off");
    } else {
        el.classList.add('invert-off');
        el.classList.remove("invert-on");
    }
}
