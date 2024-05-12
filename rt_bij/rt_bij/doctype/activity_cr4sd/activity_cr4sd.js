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
const truncate_field_values = (frm, fields) => {
    fields.forEach(field => {
        frm.set_value(field, '');
    });
}
frappe.ui.form.on("Activity CR4SD", {
    refresh(frm) {
        apply_filter("district", "state", frm, frm.doc.state)
        apply_filter("talukatehsil", "district", frm, frm.doc.district)
        apply_filter("gram_panchayat", "block", frm, frm.doc.talukatehsil)
        apply_filter("village", "grampanchayat", frm, frm.doc.gram_panchayat)
        apply_filter("villages", "grampanchayat", frm, frm.doc.gram_panchayat)
    },
    geographical_level_of_the_event_organised: function (frm) {
        truncate_field_values(frm, ['district', 'talukatehsil', 'gram_panchayat', 'activity_conducted_at', 'village', 'villages']);
    },
    state: function (frm) {
        truncate_field_values(frm, ['district', 'talukatehsil', 'gram_panchayat', 'village', 'villages']);
    },
    district: function (frm) {
        apply_filter("talukatehsil", "district", frm, frm.doc.district);
        truncate_field_values(frm, ['talukatehsil', 'gram_panchayat', 'village', 'villages']);
    },
    talukatehsil: function (frm) {
        apply_filter("gram_panchayat", "block", frm, frm.doc.talukatehsil)
        truncate_field_values(frm, ['gram_panchayat', 'village', 'villages']);
    },
    gram_panchayat: function (frm) {
        apply_filter("village", "grampanchayat", frm, frm.doc.gram_panchayat)
        apply_filter("villages", "grampanchayat", frm, frm.doc.gram_panchayat)
        truncate_field_values(frm, ['village', 'villages']);
    },
});
