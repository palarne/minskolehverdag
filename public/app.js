let pid,mode,q=[],i=0,a=[];

function go(){
pid=document.getElementById("pid").value;
document.getElementById("start").style.display="none";
document.getElementById("mode").style.display="block";
}

function start(){
mode=document.querySelector('input[name=m]:checked').value;

fetch(`/data/${mode}.json`)
.then(r=>r.json())
.then(d=>{
q=d;i=0;
document.getElementById("mode").style.display="none";
document.getElementById("q").style.display="block";
show();
});
}

function show(){
document.getElementById("t").innerText=q[i].text;

let html="";
q[i].options.forEach(o=>{
html+=`<label><input type='radio' name='o' value='${o}'>${o}</label><br>`;
});

document.getElementById("o").innerHTML=html;
}

function next(){
a[i]={
answer:document.querySelector("input[name=o]:checked")?.value,
comment:document.getElementById("c").value
};

i++;

if(i>=q.length){
fetch("/submit",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({participantId:pid,mode,answers:a})
});

document.getElementById("q").style.display="none";
document.getElementById("done").style.display="block";
}
else show();
}

function back(){
if(i>0)i--;
show();
}