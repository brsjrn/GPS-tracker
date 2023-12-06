export function createElement(tagName, attributes = {}) {
    const element = document.createElement(tagName)

    for(const [attribute, value] of Object.entries(attributes)) {
        element.setAttribute(attribute, value)
    }

    return element
}

export function createModal(id, title, message) {
    let modal = createElement("div", {
        id: id,
        class: "modal fade",
        'data-bs-backdrop': "static",
        'data-bs-keyboard': "false",
        'tabindex': "-1"
    })

    // modal.setAttribute('data-bs-backdrop', 'static')

    modal.innerHTML = `
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">${title}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
            ${message}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Understood</button>
            </div>
        </div>
    </div>
    `

    

    return modal
}