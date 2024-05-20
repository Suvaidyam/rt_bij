frappe.ui.form.on("Beneficiary Profiling", {
    refresh(frm) {
        checkApprover(frm)
        updateStateStatus(frm)
    },
});

function checkApprover(frm) {
    if (!frappe.user.has_role("Surveyor")) {
        frm.add_custom_button(__('Accept'), () => {
            // console.log('Accepted', frappe.user.has_role("State User"));
            if (frappe.user.has_role("State User")) {
                frm.set_value('state_level_status', 'Accepted');
                frm.save();
            }
            if (frappe.user.has_role("District User")) {
                frm.set_value('district_level_status', 'Accepted');
                frm.save();
            }
        }).css({
            'background-color': 'green',
            'color': 'white',
            'border': 'none',
            'padding': '10px 20px',
            'border-radius': '5px',
            'cursor': 'pointer'
        });
        frm.add_custom_button(__('Reject'), () => {
            // console.log('Rejected', frappe.user.has_role("State User"));
            if (frappe.user.has_role("State User")) {
                frm.set_value('state_level_status', 'Rejected');
                frm.save();
            }
            if (frappe.user.has_role("District User")) {
                frm.set_value('district_level_status', 'Rejected');
                frm.save();
            }
        }).css({
            'background-color': 'red',
            'color': 'white',
            'border': 'none',
            'padding': '10px 20px',
            'border-radius': '5px',
            'cursor': 'pointer'
        });
    }
}

function updateStateStatus(frm) {
    if (frappe.user.has_role('District User')) {
        if (frm.doc.district_level_status === "Accepted") {
            frm.set_value('state_level_status', 'Pending From State Level');
        } else if (frm.doc.district_level_status === "Rejected" || "Pending") {
            frm.set_value('state_level_status', 'Pending');
        }
    }
}