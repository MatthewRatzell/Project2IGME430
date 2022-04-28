(()=>{var e={603:e=>{const t=e=>{console.log(`${e}`),document.getElementById("errorMessage").textContent=e,document.getElementById("taskMessage").classList.remove("hidden")};e.exports={handleError:t,sendPost:async(e,a,n)=>{const s=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});document.getElementById("taskMessage").classList.add("hidden");const r=await s.json();r.error&&t(r.error),r.redirect&&(window.location=r.redirect),n&&n(r)},makeid:function(){for(var e="",t="abcdefghijklmnopqrstuvwxyz",a=0;a<12;a++)e+=t.charAt(Math.floor(Math.random()*t.length));return e},makeCardsCollaspsible:function(){let e=document.getElementsByClassName("collapsible");for(let t=0;t<e.length;t++)e[t].addEventListener("click",(function(){this.classList.toggle("active");let e=this.nextElementSibling;e.style.maxHeight?e.style.maxHeight=null:e.style.maxHeight=e.scrollHeight+"px"}))},getCsrfToken:async()=>{const e=await fetch("/getToken");return(await e.json()).csrfToken},hideError:()=>{document.getElementById("taskMessage").classList.add("hidden")}}}},t={};function a(n){var s=t[n];if(void 0!==s)return s.exports;var r=t[n]={exports:{}};return e[n](r,r.exports,a),r.exports}(()=>{const e=a(603),t=t=>{t.preventDefault(),e.hideError();const a=t.target.querySelector("#taskTitle").value,n=t.target.querySelector("#taskDescription").value,s=t.target.querySelector("#taskDueDate").value,l=t.target.querySelector("#_csrf").value;return a&&n&&s?(e.sendPost(t.target.action,{title:a,description:n,currentSpot:"toDo",dueDate:s,_csrf:l},r),!1):(e.handleError("All Fields Are Required To Make Task!"),!1)},n=e=>React.createElement("form",{id:"taskForm",name:"taskForm",onSubmit:t,action:"/taskBoard",method:"POST",className:"taskForm"},React.createElement("div",{id:"inputs"},React.createElement("label",{htmlFor:"title",className:"is-size-4 has-text-centered"}," Title: "),React.createElement("input",{className:"input is-small",id:"taskTitle",type:"text",name:"title",placeholder:"task title"}),React.createElement("label",{htmlFor:"description",className:"is-size-4 has-text-centered"},"Description: "),React.createElement("input",{className:"input is-small",id:"taskDescription",type:"text",name:"title",placeholder:"task description"}),React.createElement("label",{htmlFor:"cardDueDate",className:"is-size-4 has-text-centered"},"Due Date:"),React.createElement("input",{className:"input is-small",id:"taskDueDate",type:"datetime-local",name:"cardDueDate"})),React.createElement("div",{id:"submitBtn"},React.createElement("input",{className:"button",type:"submit",value:"Make task"})),React.createElement("input",{id:"_csrf",type:"hidden",name:"_csrf",value:e.csrf})),s=e=>React.createElement("div",{className:"card"},React.createElement("button",{className:"collapsible Button is-size-4"},e.task.title),React.createElement("div",{id:"collapsibleContent"},React.createElement("div",{className:"middleOfCard"},React.createElement("h2",null,e.task.description)),React.createElement("div",{className:"bottomOfCard"},React.createElement("h2",null,"Due:",e.task.dueDate)))),r=async()=>{const t=await fetch("/getTasks");(t=>{const a=document.getElementById("toDo"),n=document.getElementById("inProgress"),r=document.getElementById("done"),l=document.getElementById("burnerDivHome");if(a.innerHTML="<strong><u>To Do</u></strong>",n.innerHTML="<strong><u>In Progress</u></strong>",r.innerHTML="<strong><u>Done</u></strong>",0===t.length)return React.createElement("div",{className:"taskList"},React.createElement("h3",{className:"emptytask"},"No tasks yet!"));for(let e=0;e<t.length;e++)document.getElementById("burnerDivCopy").id="burnerDiv",ReactDOM.render(React.createElement(s,{task:t[e]}),document.getElementById("burnerDiv")),"toDo"==t[e].currentSpot?a.append(document.getElementById("burnerDiv")):"inProgress"==t[e].currentSpot?n.append(document.getElementById("burnerDiv")):"done"==t[e].currentSpot&&r.append(document.getElementById("burnerDiv")),document.getElementById("burnerDiv").id=t[e].title,l.append(document.getElementById("burnerDivCopy").cloneNode(!0));e.makeCardsCollaspsible()})((await t.json()).tasks)};window.onload=async()=>{const e=await fetch("/getToken"),t=await e.json();ReactDOM.render(React.createElement(n,{csrf:t.csrfToken}),document.getElementById("makeTask")),r()}})()})();