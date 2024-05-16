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
const reset_field_values = (frm, fields) => {
    fields.forEach(field => {
        frm.set_value(field, '');
    });
}
frappe.ui.form.on("Activity   ICVD", {
    refresh(frm) {
        apply_filter("output", "option_type", frm, "Output ICVD")
        apply_filter("activity", "option_type", frm, "Activity ICVD")
        apply_filter("activity", "output", frm, frm.doc.output)
        apply_filter("district", "state", frm, frm.doc.state)
        apply_filter("talukatehsil", "district", frm, frm.doc.district)
        apply_filter("gram_panchayat", "block", frm, frm.doc.talukatehsil)
        apply_filter("village", "grampanchayat", frm, frm.doc.gram_panchayat)
    },

    state: function (frm) {
        apply_filter("district", "state", frm, frm.doc.state)
        reset_field_values(frm, ['district', 'talukatehsil', 'gram_panchayat', 'village']);
    },
    district: function (frm) {
        apply_filter("talukatehsil", "district", frm, frm.doc.district)
        reset_field_values(frm, ['talukatehsil', 'gram_panchayat', 'village']);
    },
    talukatehsil: function (frm) {
        apply_filter("gram_panchayat", "block", frm, frm.doc.talukatehsil)
        reset_field_values(frm, ['gram_panchayat', 'village']);
    },
    gram_panchayat: function (frm) {
        apply_filter("village", "grampanchayat", frm, frm.doc.gram_panchayat)
        reset_field_values(frm, ['village']);
    },

    number_of_fposfarmer_collectives_participated: function (frm) {
        integer_length_validator(frm.doc.number_of_fposfarmer_collectives_participated, 10, 'Number of FPOs/Farmer Collectives Participated');
    },
    no_of_bodsfarmers_participated: function (frm) {
        integer_length_validator(frm.doc.no_of_bodsfarmers_participated, 10, 'No. of BoDs/Farmers participated');
    },
    no_of_non_bodsfarmers_participated: function (frm) {
        integer_length_validator(frm.doc.no_of_non_bodsfarmers_participated, 10, 'No. of non_BoDs/farmers participated');
    },
    no_of_farmers: function (frm) {
        integer_length_validator(frm.doc.no_of_farmers, 10, 'No of farmers');
    },
    value_of_transaction: function (frm) {
        integer_length_validator(frm.doc.value_of_transaction, 10, 'Value of transaction');
    },
    volumes: function (frm) {
        integer_length_validator(frm.doc.volumes, 10, 'Volumes');
    },
    price_offered_inrquintal: function (frm) {
        integer_length_validator(frm.doc.price_offered_inrquintal, 10, 'Price Offered (INR/Quintal)');
    },
    price_offered_in_the_local_market: function (frm) {
        integer_length_validator(frm.doc.price_offered_in_the_local_market, 10, 'Price offered in the local market');
    },
    savings_in_transport_inr_per_quintal: function (frm) {
        integer_length_validator(frm.doc.savings_in_transport_inr_per_quintal, 10, 'Savings in Transport (INR per quintal)');
    },
    savings_in_arthiya_commission_inr_per_quintal: function (frm) {
        integer_length_validator(frm.doc.savings_in_arthiya_commission_inr_per_quintal, 10, 'Savings in Arthiya Commission (INR per quintal)');
    },
    total_incremental_income_benefit_to_farmer: function (frm) {
        integer_length_validator(frm.doc.total_incremental_income_benefit_to_farmer, 10, 'Total Incremental Income Benefit to Farmer');
    },
    area_of_land_on_which_adopted: function (frm) {
        integer_length_validator(frm.doc.area_of_land_on_which_adopted, 10, 'Area of land on which adopted');
    },
    no_of_farmers_adopting_the_techpractice: function (frm) {
        integer_length_validator(frm.doc.no_of_farmers_adopting_the_techpractice, 10, 'No of farmers adopting the techpractice');
    },
    number_of_fposfarmer_collectives_participated: function (frm) {
        integer_length_validator(frm.doc.number_of_fposfarmer_collectives_participated, 10, 'Number of FPOs/farmer collectives participated');
    },
    validate(frm) {
        integer_length_validator(frm.doc.number_of_fposfarmer_collectives_participated, 10, 'Number of FPOs/Farmer Collectives Participated');
        integer_length_validator(frm.doc.no_of_bodsfarmers_participated, 10, 'No. of BoDs/Farmers participated');
        integer_length_validator(frm.doc.no_of_non_bodsfarmers_participated, 10, 'No. of non_BoDs/farmers participated');
        integer_length_validator(frm.doc.no_of_farmers, 10, 'No of farmers');
        integer_length_validator(frm.doc.value_of_transaction, 10, 'Value of transaction');
        integer_length_validator(frm.doc.volumes, 10, 'Volumes');
        integer_length_validator(frm.doc.price_offered_inrquintal, 10, 'Price Offered (INR/Quintal)');
        integer_length_validator(frm.doc.price_offered_in_the_local_market, 10, 'Price offered in the local market');
        integer_length_validator(frm.doc.savings_in_transport_inr_per_quintal, 10, 'Savings in Transport (INR per quintal)');
        integer_length_validator(frm.doc.savings_in_arthiya_commission_inr_per_quintal, 10, 'Savings in Arthiya Commission (INR per quintal)');
        integer_length_validator(frm.doc.total_incremental_income_benefit_to_farmer, 10, 'Total Incremental Income Benefit to Farmer');
        integer_length_validator(frm.doc.area_of_land_on_which_adopted, 10, 'Area of land on which adopted');
        integer_length_validator(frm.doc.no_of_farmers_adopting_the_techpractice, 10, 'No of farmers adopting the techpractice');
        integer_length_validator(frm.doc.number_of_fposfarmer_collectives_participated, 10, 'Number of FPOs/farmer collectives participated');
    },
    output: function (frm) {
        reset_field_values(frm, ["topic_of_the_training_conducted", "farmer_producer_organisation_fpo_1", "number_of_fposfarmer_collectives_participated", "no_of_bodsfarmers_participated", "no_of_non_bodsfarmers_participated", "name_of_the_trainer", "collaborating_agenciesdepartment", "remarks", "activity"])
    },
});
