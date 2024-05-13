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
const integer_length_validator = (value, reqd_length, label) => {
    if (value && String(value).length > reqd_length) {
        frappe.throw(`Count of ${label} can't be more than ${reqd_length} digits!`)
    }
}
frappe.ui.form.on("CR4SD Output Form", {
    refresh(frm) {
        apply_filter("district", "state", frm, frm.doc.state)
        apply_filter("block", "district", frm, frm.doc.district)
        apply_filter("talukatehsil", "block", frm, frm.doc.block)
        apply_filter("gram_panchayat", "grampanchayat", frm, frm.doc.talukatehsil)
        apply_filter("village", "village", frm, frm.doc.gram_panchayat)
    },
    state: function (frm) {
        apply_filter("district", "state", frm, frm.doc.state)
    },
    district: function (frm) {
        apply_filter("block", "district", frm, frm.doc.district)
    },
    block: function (frm) {
        apply_filter("talukatehsil", "block", frm, frm.doc.block)
    },
    talukatehsil: function (frm) {
        apply_filter("gram_panchayat", "grampanchayat", frm, frm.doc.talukatehsil)
    },
    gram_panchayat: function (frm) {
        apply_filter("village", "village", frm, frm.doc.gram_panchayat)
    },
    villages: function (frm) {
        apply_filter("village", "village", frm, frm.doc.gram_panchayat)
    },
    before_save(frm) {
        ["phone_numbers_of_the_sarpanch", "phone_numbers_of_the_sarpanch2", "phone", "phone2", "phone3", "phone4"].forEach(field => {
            if (frm.doc[field] === "+91-") {
                frm.doc[field] = "";
            }
        });
    },
    validate(frm) {
        integer_length_validator(frm.doc.leverage_amount, 7, 'Leverage Amount');
        integer_length_validator(frm.doc.leverage_amount2, 7, 'Leverage Amount');
        integer_length_validator(frm.doc.extent_of_area_where_the_practices_adopted, 7, 'Extent of area where the practices adopted');
        integer_length_validator(frm.doc.leverage_amount_23, 10, 'Leverage Amount (2.3)');
        integer_length_validator(frm.doc.increased_area, 7, 'Increased area');
        integer_length_validator(frm.doc.leverage_amount_24, 7, 'Leverage Amount (2.4)');
        integer_length_validator(frm.doc.estimated_number_of_households_benefitted, 5, 'Estimated number of Households benefitted');
        integer_length_validator(frm.doc.area_of_extent_climate_adaptive_farming_practices_taken_up, 5, 'Area of Extent climate adaptive farming practices taken up');
        integer_length_validator(frm.doc.no_of_initiatives, 7, 'No. of Initiatives');
        integer_length_validator(frm.doc.leverage_money, 10, 'Leverage Money');
        integer_length_validator(frm.doc.area, 10, 'Area');
    },
    leverage_amount: function (frm) {
        integer_length_validator(frm.doc.leverage_amount, 7, 'Leverage Amount');
    },
    leverage_amount2: function (frm) {
        integer_length_validator(frm.doc.leverage_amount2, 7, 'Leverage Amount');
    },
    extent_of_area_where_the_practices_adopted: function (frm) {
        integer_length_validator(frm.doc.extent_of_area_where_the_practices_adopted, 7, 'Extent of area where the practices adopted');
    },
    leverage_amount_23: function (frm) {
        integer_length_validator(frm.doc.leverage_amount_23, 10, 'Leverage Amount (2.3)');
    },
    increased_area: function (frm) {
        integer_length_validator(frm.doc.increased_area, 7, 'Increased area');
    },
    leverage_amount_24: function (frm) {
        integer_length_validator(frm.doc.leverage_amount_24, 7, 'Leverage Amount (2.4)');
    },
    estimated_number_of_households_benefitted: function (frm) {
        integer_length_validator(frm.doc.estimated_number_of_households_benefitted, 5, 'Estimated number of Households benefitted');
    },
    area_of_extent_climate_adaptive_farming_practices_taken_up: function (frm) {
        integer_length_validator(frm.doc.area_of_extent_climate_adaptive_farming_practices_taken_up, 5, 'Area of Extent climate adaptive farming practices taken up');
    },
    no_of_initiatives: function (frm) {
        integer_length_validator(frm.doc.no_of_initiatives, 7, 'No. of Initiatives');
    },
    leverage_money: function (frm) {
        integer_length_validator(frm.doc.leverage_money, 10, 'Leverage Money');
    },
    area: function (frm) {
        integer_length_validator(frm.doc.area, 10, 'Area');
    },

});
