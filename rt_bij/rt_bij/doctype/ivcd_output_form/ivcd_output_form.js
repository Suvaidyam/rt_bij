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

const reset_field_values = (frm, fields) => {
    fields.forEach(field => {
        frm.set_value(field, '');
    });
}

const integer_length_validator = (value, reqd_length, label) => {
    if (value && String(value).length > reqd_length) {
        frappe.throw(`Count of ${label} can't be more than ${reqd_length} digits!`)
    }
}

frappe.ui.form.on("IVCD Output Form", {
    refresh(frm) {
        apply_filter("district", "state", frm, frm.doc.state)
        apply_filter("block", "district", frm, frm.doc.district)
        apply_filter("grampanchayat", "block", frm, frm.doc.block)
        apply_filter("village", "grampanchayat", frm, frm.doc.grampanchayat)
    },
    state: function (frm) {
        reset_field_values(frm, ['district', 'block', 'grampanchayat', 'village']);
    },
    district: function (frm) {
        apply_filter("block", "district", frm, frm.doc.district);
        reset_field_values(frm, ['block', 'grampanchayat', 'village']);
    },
    block: function (frm) {
        apply_filter("grampanchayat", "block", frm, frm.doc.block)
        reset_field_values(frm, ['grampanchayat', 'village']);
    },
    grampanchayat: function (frm) {
        apply_filter("village", "grampanchayat", frm, frm.doc.grampanchayat)
        reset_field_values(frm, ['village']);
    },
    before_save: function (frm) {
        if (frm.doc.phone_number === '+91-') {
            frm.doc.phone_number = '';
        }
    },
    validate(frm) {
        // Outreach
        integer_length_validator(frm.doc.area_covered, 7, 'Area Covered');
        integer_length_validator(frm.doc.if_yes_what_age, 3, 'If Yes, what %age?');
        // 4.2 Farmers adopting and benefitting with improved practices and/or new agriculture technologies
        integer_length_validator(frm.doc.area_of_land_on_which_adopted_in_hectares, 7, 'Area of land on which adopted (In Hectares)');
        integer_length_validator(frm.doc.no_of_farmers_adopting_the_techpractice, 5, 'No. of Farmers adopting the tech/practice');
        // 5.1 Farmer collectives (FPOs/ SHG Federations/Co-op/ PACS/ Informal group of farmers) provided techno-managerial support and/or linkages
        integer_length_validator(frm.doc.number_of_fposfarmer_collectives_participated, 7, 'Number of FPOs/Farmer Collectives Participated');
        integer_length_validator(frm.doc.no_of_bodsfarmers_participated, 7, 'No. of BoDs/Farmers participated');
        integer_length_validator(frm.doc.no_of_nonbodsfarmers_participated, 7, 'No. of non-BoDs/farmers participated');
        // 5.2 Producers benefitting from marketing of their produce / accessing products and services from Farmer Collectives
        integer_length_validator(frm.doc.no_of_farmers, 7, 'No of Farmers');
        integer_length_validator(frm.doc.value_of_transaction, 10, 'Value of Transaction');
        integer_length_validator(frm.doc.volumes, 7, 'Volumes');
        integer_length_validator(frm.doc.price_offered_inrquintal, 10, 'Price Offered (INR/Quintal)');
        integer_length_validator(frm.doc.price_offered_in_the_local_market, 10, 'Price offered in the local market');
        integer_length_validator(frm.doc.savings_in_transport_inr_per_quintal, 10, 'Savings in Transport (INR per quintal)');
        integer_length_validator(frm.doc.savings_in_arthiya_commission_inr_per_quintal, 10, 'Savings in Arthiya Commission (INR per quintal)');
        integer_length_validator(frm.doc.total_incremental_income_benefit_to_farmer, 10, 'Total Incremental Income Benefit to Farmer');
        // 5.3 Value of produce marketed and inputs/services sourced through farmer collectives
        integer_length_validator(frm.doc.no_of_farmers_2, 7, 'No of Farmers');
        integer_length_validator(frm.doc.value_of_transaction_2, 10, 'Value of Transaction');
        integer_length_validator(frm.doc.volumes_2, 7, 'Volumes');
        integer_length_validator(frm.doc.price_offered, 10, 'Price Offered (INR/Quintal)');
        integer_length_validator(frm.doc.price_offered_in_the_local_market_2, 10, 'Price offered in the local market');
        integer_length_validator(frm.doc.savings_in_transport_2, 10, 'Savings in Transport (INR per quintal)');
        integer_length_validator(frm.doc.savings_in_arthiya_commission_2, 10, 'Savings in Arthiya Commission (INR per quintal)');
        integer_length_validator(frm.doc.total_incremental_income_benefit_to_farmer_2, 10, 'Total Incremental Income Benefit to Farmer');
    },
    // Outreach
    area_covered: function (frm) {
        integer_length_validator(frm.doc.area_covered, 7, 'Area Covered');
    },
    if_yes_what_age: function (frm) {
        integer_length_validator(frm.doc.if_yes_what_age, 3, 'If Yes, what %age?');
    },
    // 4.2 Farmers adopting and benefitting with improved practices and/or new agriculture technologies
    area_of_land_on_which_adopted_in_hectares: function (frm) {
        integer_length_validator(frm.doc.area_of_land_on_which_adopted_in_hectares, 7, 'Area of land on which adopted (In Hectares)');
    },
    no_of_farmers_adopting_the_techpractice: function (frm) {
        integer_length_validator(frm.doc.no_of_farmers_adopting_the_techpractice, 5, 'No. of Farmers adopting the tech/practice');
    },
    // 5.1 Farmer collectives (FPOs/ SHG Federations/Co-op/ PACS/ Informal group of farmers) provided techno-managerial support and/or linkages
    number_of_fposfarmer_collectives_participated: function (frm) {
        integer_length_validator(frm.doc.number_of_fposfarmer_collectives_participated, 7, 'Number of FPOs/Farmer Collectives Participated');
    },
    no_of_bodsfarmers_participated: function (frm) {
        integer_length_validator(frm.doc.no_of_bodsfarmers_participated, 7, 'No. of BoDs/Farmers participated');
    },
    no_of_nonbodsfarmers_participated: function (frm) {
        integer_length_validator(frm.doc.no_of_nonbodsfarmers_participated, 7, 'No. of non-BoDs/farmers participated');
    },
    // 5.2 Producers benefitting from marketing of their produce / accessing products and services from Farmer Collectives
    no_of_farmers: function (frm) {
        integer_length_validator(frm.doc.no_of_farmers, 7, 'No of Farmers');
    },
    value_of_transaction: function (frm) {
        integer_length_validator(frm.doc.value_of_transaction, 10, 'Value of Transaction');
    },
    volumes: function (frm) {
        integer_length_validator(frm.doc.volumes, 7, 'Volumes');
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
    // 5.3 Value of produce marketed and inputs/services sourced through farmer collectives
    no_of_farmers_2: function (frm) {
        integer_length_validator(frm.doc.no_of_farmers_2, 7, 'No of Farmers');
    },
    value_of_transaction_2: function (frm) {
        integer_length_validator(frm.doc.value_of_transaction_2, 10, 'Value of Transaction');
    },
    volumes_2: function (frm) {
        integer_length_validator(frm.doc.volumes_2, 7, 'Volumes');
    },
    price_offered: function (frm) {
        integer_length_validator(frm.doc.price_offered, 10, 'Price Offered (INR/Quintal)');
    },
    price_offered_in_the_local_market_2: function (frm) {
        integer_length_validator(frm.doc.price_offered_in_the_local_market_2, 10, 'Price offered in the local market');
    },
    savings_in_transport_2: function (frm) {
        integer_length_validator(frm.doc.savings_in_transport_2, 10, 'Savings in Transport (INR per quintal)');
    },
    savings_in_arthiya_commission_2: function (frm) {
        integer_length_validator(frm.doc.savings_in_arthiya_commission_2, 10, 'Savings in Arthiya Commission (INR per quintal)');
    },
    total_incremental_income_benefit_to_farmer_2: function (frm) {
        integer_length_validator(frm.doc.total_incremental_income_benefit_to_farmer_2, 10, 'Total Incremental Income Benefit to Farmer');
    },
});