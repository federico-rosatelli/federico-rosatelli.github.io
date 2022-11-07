const languageColor = {
    "Python":"3572A5",
    "EJS":"a91e50",
    "JavaScript":"f1e05a"
};

fetch("https://api.github.com/users/federico-rosatelli")
    .then((data)=>data.json())
    .then((data)=>{
        let a = `<div class="row-git"><a href="https://github.com/federico-rosatelli/" target="_blank"><img src="${data.avatar_url}" id="github-avatar"></img></a><p>federico-rosatelli</p></div>`;
        document.getElementById("github").innerHTML = a;
    });


fetch("https://api.github.com/users/federico-rosatelli/repos")
    .then((data)=>data.json())
    .then((data)=>{
        data.sort((a,b)=>(a.created_at>b.created_at) ? 1 : -1);
        let pinned = [data[10],data[7],data[4],data[8]];
        let div = document.createElement("div");
        let html = `<div class="grid-container">`;
        
        for (let i = 0; i < pinned.length; i++) {
            console.log(pinned[i].language);
            html += `
            <div class="github-data">
                <div class="title">
                    <a href="${pinned[i].html_url}" target="_blank">${pinned[i].name}</a>
                    <p>${pinned[i].description ? pinned[i].description : ""}</p>
                </div>
                <div class="data-project">
                    <span class="repo-language" style="background-color:#${languageColor[pinned[i].language]}"></span>
                    <p>${pinned[i].language}</p>
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="repo-file">
                        <path fill="#ffffff" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path>
                    </svg>
                    <p>${pinned[i].size}</p>
                </div>
            </div>`;
        }
        html += `</div>`;
        html += `<div class="continue-git"><a href="https://github.com/bhackfox/" target="_blank">More ...</a></div>`;

        div.innerHTML = html;
        document.getElementById("github").appendChild(div);
        
    });


var timeWait = Date.now();
function sendMessage(){
    var name = document.getElementById("name-form").value;
    var email = document.getElementById("email-form").value;
    var phone = document.getElementById("phone-form").value;
    var message = document.getElementById("message-form").value;
    var id_j_error = document.getElementById("id-error");
    var id_j_ok = document.getElementById("id-ok");
    document.getElementById("name-form").value = "";
    document.getElementById("email-form").value = "";
    document.getElementById("phone-form").value = "";
    document.getElementById("message-form").value = "";
    if(id_j_error){
        id_j_error.outerHTML = "";
    }
    if(id_j_ok){
        id_j_ok.outerHTML = "";
    }
    if(name && email && message){
        var id_ok = document.createElement("div");
        id_ok.setAttribute("id","id-ok");
        let msg = "You Have To Wait...";
        if (Date.now()-timeWait > 3000){
            timeWait = Date.now();
            msg = "Message Sent!";
            fetch('/contactme',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    name:name,
                    email:email,
                    phone:phone,
                    message:message
                })
            });
        }
        var ok = `<div class="btn-lrg id-btn" style="background-color: rgb(97, 255, 118);">${msg}</div>`;
        id_ok.innerHTML = ok;
        document.getElementById("id-form").appendChild(id_ok);
    }
    else{
        var id_error = document.createElement("div");
        id_error.setAttribute("id","id-error");
        var error = `<div class="btn-lrg id-btn" style="background-color: rgb(255 75 78);">You Have To Fill *</div>`;
        id_error.innerHTML = error;
        document.getElementById("id-form").appendChild(id_error);
    }
    
  
}
