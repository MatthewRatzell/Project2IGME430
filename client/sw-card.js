const template = document.createElement('template');
template.innerHTML = `
<style>  
h2,h3
{
    font-size: 2.0rem;
    margin-top: 0;
    color: #000080;
}
.card 
  {
    overflow:auto;
    padding:5%;
    background-color: rgb(192, 189, 189) !important;
    height: 350px;
    width: 325px;
    margin-bottom:10px;
    justify-content:center;
  }
  .topOfCard{
    margin-bottom:5%;
  }
  .middleOfCard{
    margin-bottom:10%;
  }
  .bottomOfCard{
  }

.card:hover 
  {
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  }

</style>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<body>

<div class="card">
  <div class="topOfCard"
    <h2 id="title" class="has-text-centered is-size-3">25</h2>
    </div>

    <div class="middleOfCard"
    <h2 class="has-text-centered is-size-4" id="description">25</h2>
    </div>
    
    <div class="bottomOfCard"
    <h2 id="dueDate" class="has-text-centered is-size-5">25</h2>
    </div>



</div>
  </body>


`;
// making sure ffavorites is set equal to the local storage
class swCard extends HTMLElement {
  constructor() {
    super();

    // attach a shadowdom treeto this instance this creasts a shadown root for us
    this.attachShadow({ mode: 'open' });// allows debugging when open
    // clone template and append it
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    ondrop = function () { return false; };
    // making sure we call our render function
    this.render();
  }

  // once we hook this favro
  disconnectedCallback() {

  }

  // updating the code
  attributeChangedCallback(attributeName, oldVal, newVal) {
    // console.log(attributeName, oldVal, newVal);
    this.render();
  }

  // telling component to observe/watch these values
  static get observedAttributes() {
    return ['data-title', 'data-description', 'data-duedate'];
  }

  render() {
    this.titleDOM = this.shadowRoot.querySelector('#title');
    this.descriptionDOM = this.shadowRoot.querySelector('#description');
    this.dueDateDOM = this.shadowRoot.querySelector('#dueDate');


    const title = this.getAttribute('data-title') ? this.getAttribute('data-title') : '<i>...game title...</i>';
    const description = this.getAttribute('data-description') ? this.getAttribute('data-description') : '0';
    const dueDate = this.getAttribute('data-duedate') ? this.getAttribute('data-duedate') : '<i>...game title...</i>';


    this.titleDOM.innerHTML = `${title}`;
    this.descriptionDOM.innerHTML = `${description}`;
    this.dueDateDOM.innerHTML = `Due:${dueDate}`;

  }
}// end class

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev) {
  ev.preventDefault();
  if (ev.target.className === 'clonedDiv' || ev.target.className === "card")
    return;
  var data = ev.dataTransfer.getData("text");
  //console.log(document.getElementById(data));
  ev.target.appendChild(document.getElementById(data));
}


customElements.define('sw-card', swCard);