function addColumn() {
    // Create a new div element
    const newDiv = document.createElement('div');
    newDiv.className = 'list-row-col ellipsis hidden-xs';

    // Create a new span element
    const newSpan = document.createElement('span');
    newSpan.setAttribute('data-sort-by', 'priority');
    newSpan.setAttribute('title', 'Click to sort by Priority');
    newSpan.textContent = 'Priority';

    // Append the span to the div
    newDiv.appendChild(newSpan);

    // Append the new div to the parent container
    const parent = document.querySelector('.level-left.list-header-subject');
    parent.appendChild(newDiv);
    console.log(parent)
}

frappe.listview_settings['CRS4D activity form'] = {
    onload: function (listview) {
        $('.layout-side-section').hide();
        // const parentElement = document.querySelector(".level-left.list-header-subject");
        // parentElement.innerHTML = `<div class="list-row-col ellipsis "><span>Test</span></div>`
        // parentElement.appendChild(parentElement)
        // addColumn();
    }

};