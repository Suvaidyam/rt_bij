frappe.ui.form.on("Beneficiary Profiling", {
    refresh(frm) {
        if (!frappe.user.has_role("Surveyor")) {
            frm.add_custom_button(__('Accept'), () => {
                frm.set_value('state_lable_status', 'Accepted');
                frm.save();
            }).css({
                'background-color': 'green',
                'color': 'white',
                'border': 'none',
                'padding': '10px 20px',
                'border-radius': '5px',
                'cursor': 'pointer'
            });

            frm.add_custom_button(__('Reject'), () => {
                frm.set_value('state_lable_status', 'Rejected');
                frm.save();
                
            }).css({
                'background-color': 'red',
                'color': 'white',
                'border': 'none',
                'padding': '10px 20px',
                'border-radius': '5px',
                'cursor': 'pointer'
            });
        }
    },
});
