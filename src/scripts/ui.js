function ui(){
    class MyTag extends HTMLElement {
         
        connectedCallback() {
            this.title = this.getAttribute("title") || null;
            this.render();
        }
        render() {
            this.innerHTML = 
            `<header>
                <nav class="navbar navbar-expand-sm bg-warning">
                    <a class="navbar-brand text-white" href="#">${this.title}</a>
                </nav>
            </header><br>`;
        }          
        attributeChangedCallback(name, newValue) {
            this[name] = newValue;
            this.render();
        }
    }
    document.addEventListener("DOMContentLoaded",function () {
        customElements.define("my-navbar", MyTag);
    })
}

export default ui;
