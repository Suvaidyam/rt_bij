frappe.listview_settings['Beneficiary Profiling'] = {
    onload: function (listview) {
        if (!frappe.user.has_role("Surveyor")) {
            listview?.page?.add_inner_button('Accepted All', function (e) {
                // console.log('Accepted All', listview);
                listview?.data?.forEach(function (row) {
                    if (frappe.user.has_role("State User")) {
                        frappe.db.set_value('Beneficiary Profiling', row.name, 'state_level_status', 'Accepted');
                    }
                    if (frappe.user.has_role("District User")) {
                        frappe.db.set_value('Beneficiary Profiling', row.name, 'district_level_status', 'Accepted');
                    }
                });
                listview.refresh();


            }).css({
                'background-color': 'green',
                'color': 'white',
                'border': 'none',
                'padding': '10px 20px',
                'border-radius': '5px',
                'cursor': 'pointer'
            });
            listview?.page?.add_inner_button('Rejected All', function () {
                console.log('Rejected All', listview);
                listview?.data?.forEach(function (row) {
                    if (frappe.user.has_role("State User")) {
                        frappe.db.set_value('Beneficiary Profiling', row.name, 'state_level_status', 'Rejected');
                    }
                    if (frappe.user.has_role("District User")) {
                        frappe.db.set_value('Beneficiary Profiling', row.name, 'district_level_status', 'Rejected');
                    }
                });
                listview.refresh();
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
};
