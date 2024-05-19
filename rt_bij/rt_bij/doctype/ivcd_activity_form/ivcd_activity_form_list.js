frappe.listview_settings['IVCD activity form'] = {
    get_indicator: function(doc) {
        return null;
    },
    onload: function (listview) {
        console.log(listview, 'listview');
        $('.layout-side-section').hide();
        // listview.columns.push({
        //     type: "Field",
        //     df: {
        //         label: "sdfsf",
        //         fieldname: "creation",
        //         width: 40,
        //         in_list_view: 1,
        //         read_only: 1
        //     }
        // });
        document.addEventListener("DOMContentLoaded", function() {
            // Assuming 'likes-section' is the class of the likes section
            var likesSection = document.querySelector('.like-icon');
            console.log(likesSection);
            if (likesSection) {
                likesSection.style.display = 'none';
            }
        });

    },
};