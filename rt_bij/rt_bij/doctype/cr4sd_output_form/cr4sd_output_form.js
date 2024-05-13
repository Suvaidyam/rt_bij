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
frappe.ui.form.on("CR4SD Output Form", {
	refresh(frm) {
        apply_filter("district", "state", frm, frm.doc.state)
        apply_filter("block", "district", frm, frm.doc.district)
        apply_filter("talukatehsil", "block", frm, frm.doc.block)
        apply_filter("gram_panchayat", "grampanchayat", frm, frm.doc.talukatehsil)
        apply_filter("village", "village", frm, frm.doc.gram_panchayat)

        // console.log("refreshed",frm.doc)
    },

    state: function(frm) {
        apply_filter("district", "state", frm, frm.doc.state)
    },
    district: function(frm) {
        apply_filter("block", "district", frm, frm.doc.district)
    },
    block: function(frm) {
        apply_filter("talukatehsil", "block", frm, frm.doc.block)
    },
    talukatehsil: function(frm) {
        apply_filter("gram_panchayat", "grampanchayat", frm, frm.doc.talukatehsil)
    },
    gram_panchayat: function(frm) {
        apply_filter("village", "village", frm, frm.doc.gram_panchayat)
    },
    villages: function(frm) {
        apply_filter("village", "village", frm, frm.doc.gram_panchayat)
    },
    before_save(frm) {
        if (frm.doc.phone_numbers_of_the_sarpanch == "+91-") {
            frm.doc.phone_numbers_of_the_sarpanch = "";
        }
        
        if (frm.doc.phone_numbers_of_the_sarpanch2 == "+91-") {
            frm.doc.phone_numbers_of_the_sarpanch2 = "";
        }
        if (frm.doc.phone2 == "+91-") {
            frm.doc.phone2 = "";
        }
        if (frm.doc.phone3 == "+91-") {
            frm.doc.phone3 = "";
        }
        if (frm.doc.phone4 == "+91-") {
            frm.doc.phone4 = "";
        }
      


    }
        
            
	
});
