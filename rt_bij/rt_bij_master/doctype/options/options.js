// Copyright (c) 2024, suvaidyam and contributors
// For license information, please see license.txt

function apply_filter(field_name, filter_on, frm, filter_value, withoutFilter = false) {
    frm.fields_dict[field_name].get_query = () => {
        if (withoutFilter) {
            return {
                filters: {},
                page_length: 1000
            };
        }
        return {
            filters: {
                [filter_on]: filter_value || frm.doc[filter_on] || `please select ${filter_on}`,
            },
            page_length: 1000
        };
    }
};

frappe.ui.form.on("Options", {
    refresh(frm) {
    },
    option_type: function (frm) {
        let ot = frm.doc.option_type;
        if (ot == "Activity") {
            apply_filter('output', 'option_type', frm, "Output")
        } else if (ot == "Activity ICVD") {
            apply_filter('output', 'option_type', frm, "Output ICVD")
        }
    }
});
