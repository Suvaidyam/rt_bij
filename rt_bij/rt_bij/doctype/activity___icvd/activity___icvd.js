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

frappe.ui.form.on("Activity   ICVD", {
    refresh(frm) {
        apply_filter("output", "option_type", frm, "Activity ICVD")
    },
    number_of_fposfarmer_collectives_participated: function (frm) {
        maximum_10_digits_validation(frm, 'number_of_fposfarmer_collectives_participated')
    },
    no_of_bodsfarmers_participated: function (frm) {
        maximum_10_digits_validation(frm, 'no_of_bodsfarmers_participated')
    },
    no_of_non_bodsfarmers_participated: function (frm) {
        maximum_10_digits_validation(frm, 'no_of_non_bodsfarmers_participated')
    },
    no_of_farmers: function (frm) {
        maximum_10_digits_validation(frm, 'no_of_farmers')
    },
    value_of_transaction: function (frm) {
        maximum_10_digits_validation(frm, 'value_of_transaction')
    },
    volumes: function (frm) {
        maximum_10_digits_validation(frm, 'volumes')
    },
    price_offered_inrquintal: function (frm) {
        maximum_10_digits_validation(frm, 'price_offered_inrquintal')
    },
    price_offered_in_the_local_market: function (frm) {
        maximum_10_digits_validation(frm, 'price_offered_in_the_local_market')
    },
    savings_in_transport_inr_per_quintal: function (frm) {
        maximum_10_digits_validation(frm, 'savings_in_transport_inr_per_quintal')
    },
    savings_in_arthiya_commission_inr_per_quintal: function (frm) {
        maximum_10_digits_validation(frm, 'savings_in_arthiya_commission_inr_per_quintal')
    },
    total_incremental_income_benefit_to_farmer: function (frm) {
        maximum_10_digits_validation(frm, 'total_incremental_income_benefit_to_farmer')
    },
    area_of_land_on_which_adopted: function (frm) {
        maximum_10_digits_validation(frm, 'area_of_land_on_which_adopted')
    },
    no_of_farmers_adopting_the_techpractice: function (frm) {
        maximum_10_digits_validation(frm, 'no_of_farmers_adopting_the_techpractice')
    },

    number_of_fposfarmer_collectives_participated: function (frm) {
        integer_length_validator(frm.doc.number_of_fposfarmer_collectives_participated, 10, 'Number of fposfarmer collectives participated');
    },
});
