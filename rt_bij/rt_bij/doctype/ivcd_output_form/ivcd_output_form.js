// Copyright (c) 2024, suvaidyam and contributors
// For license information, please see license.txt
function callAPI(options) {
    return new Promise((resolve, reject) => {
        frappe.call({
            ...options,
            callback: async function (response) {
                resolve(response?.message || response)
            }
        });
    })
}
function renderRelativeTime(timestamp) {
    const date = moment(timestamp);
    const now = moment();

    if (date.isSame(now, 'day')) {
        return "today";
    } else if (date.isSame(now.clone().subtract(1, 'days'), 'day')) {
        return "yesterday";
    } else {
        return date.format('MMMM Do YYYY');
    }
}
function show_comment_popup() {
    let d = new frappe.ui.Dialog({
        title: 'Add Comment',
        fields: [
            {
                label: 'Comment',
                fieldname: 'comment',
                fieldtype: 'Small Text',
                reqd: 1
            }
        ],
        primary_action_label: 'Submit',
        async primary_action(values) {
            if (values.comment) {
                await callAPI({
                    method: 'frappe.desk.form.utils.add_comment',
                    args: {
                        reference_doctype: 'IVCD output form',
                        reference_name: cur_frm.doc.name,
                        content: `<div class="ql-editor read-mode"><p>${values.comment}</p></div>`,
                        comment_email: frappe.session.user,
                        comment_by: frappe.session.user
                    }
                })
            }
            d.hide();
            cur_frm.refresh();
        }
    });
    d.show();
}
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

frappe.ui.form.on("IVCD output form", {
    async refresh(frm) {
        apply_filter("district", "state", frm, frm.doc.state)
        apply_filter("block", "district", frm, frm.doc.district)
        apply_filter("grampanchayat", "block", frm, frm.doc.block)
        apply_filter("village", "grampanchayat", frm, frm.doc.grampanchayat)
        apply_filter("output", "option_type", frm, "Output IVCD")


        let ws = await callAPI({
            method: `frappe.desk.form.load.getdoc?doctype=IVCD%20output%20form&name=${frm.doc.name}`,

        })
        const workflowLogs = ws?.docinfo?.workflow_logs?.map((e) => {
            const timestamp = e.creation;
            const relativeTime = renderRelativeTime(timestamp);
            return {
                ...e,
                creation_stamp: relativeTime,
                html: `
        <div class="timeline" style="position: relative;">
            <div class="timeline-item" data-timestamp="${timestamp}" style="display: flex; align-items: flex-start; position: relative; margin-bottom: 10px;">
                <div class="timeline-icon" style="position: relative; z-index: 1; background-color: #F3F3F3; border-radius: 50%; padding: 5px; margin-right: 10px; display: flex; align-items: center; justify-content: center;">
                    <svg class="icon icon-lg" aria-hidden="true" style="width: 20px; height: 20px;">
                        <use href="#icon-branch"></use>
                    </svg>
                </div>
                <div class="timeline-content" style="background: #fff; padding: 5px 15px; border-radius: 4px; box-shadow: 0 0 5px rgba(0,0,0,0.1); max-width: 600px;">
                    ${e?.owner} · ${e?.content}
                    <span> · <span class="frappe-timestamp" data-timestamp="${timestamp}" title="${new Date(timestamp).toLocaleString()}">${relativeTime}</span></span>
                </div>
                <div style="content: ''; position: absolute; right: 25px; top: 50%; bottom: 0; width: 2px; background-color: #ddd; z-index: -1;"></div>
            </div>
        </div>`
            };
        }) || [];
        const comments = ws?.docinfo?.comments?.map((e) => {
            const timestamp = e.creation;
            const relativeTime = renderRelativeTime(timestamp);
            return {
                ...e,
                creation_stamp: relativeTime,
                html: `
        <div class="timeline" style="position: relative;">
    <div class="timeline-item" data-timestamp="${timestamp}" style="display: flex; align-items: flex-start; position: relative; margin-bottom: 10px;">
        <div class="timeline-icon" style="position: relative; z-index: 1; background-color: #F3F3F3; border-radius: 50%; padding: 5px; margin-right: 10px; display: flex; align-items: center; justify-content: center;">
            <svg class="icon icon-lg" aria-hidden="true" style="width: 20px; height: 20px;">
                <use href="#icon-comment"></use>
            </svg>
        </div>
        <div class="timeline-content" style="background: #fff; padding: 5px 15px; border-radius: 4px; box-shadow: 0 0 5px rgba(0,0,0,0.1); width: 600px; position: relative;">
            <span>${e?.owner} · <span class="frappe-timestamp" data-timestamp="${timestamp}" title="${new Date(timestamp).toLocaleString()}">${relativeTime}</span></span>
            <div style="margin-top: 8px; display: flex; align-items: flex-start;">
                <div style="position: relative; top: -5px; background-color: #FCF0F0; padding: 5px; border-radius: 20px; color: #B5342D;">Rejection </div> 
                <div style="margin-left: 8px; max-width: 500px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${e?.content}</div>
            </div>
        </div>
        <div style="content: ''; position: absolute; right: 25px; top: 50%; bottom: 0; width: 2px; background-color: #ddd; z-index: -1;"></div>
    </div>
</div>
`};
        }) || [];
        const combinedData = [...workflowLogs, ...comments];
        combinedData.sort((a, b) => new Date(b.creation) - new Date(a.creation));
        if (combinedData.length > 0) {
            document.getElementById('workflow-table').innerHTML = combinedData.map(e => e.html).join('');
        }
    },
    onload(frm) {
        frm.page.sidebar.hide();
        $('div.form-footer').hide();
    },
    state: function (frm) {
        apply_filter("district", "state", frm, frm.doc.state)
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
    phone_number: function (frm) {
        let arr;
        if (frm.doc.phone) {
            arr = frm.doc.phone_number.split('-')
            if (arr && arr.length == 1) {
                integer_length_validator(arr[0], 10, 'Phone');
            } else if (arr && arr.length == 2) {
                integer_length_validator(arr[1], 10, 'Phone');
            }
        }
    },
    output: function (frm) {
        reset_field_values(frm, ["name_of_cropcommodity", "remarks_explain_the_impact_created", "total_incremental_income_benefit_to_farmer", "savings_in_arthiya_commission_inr_per_quintal", "savings_in_transport_inr_per_quintal", "price_offered_in_the_local_market", "price_offered_inrquintal", "volumes", "value_of_transaction", "no_of_farmers", "name_of_the_commodity", "farmer_producer_organisation_3", "remarks_3", "total_incremental_income_benefit_to_farmer_2", "savings_in_arthiya_commission_2", "savings_in_transport_2", "price_offered_in_the_local_market_2", "price_offered", "volumes_2", "value_of_transaction_2", "no_of_farmers_2", "name_of_the_commodity_2", "farmer_producer_organisation_4", "type_2", "collaborating_agenciesdepartment_2", "remarks_2", "name_of_the_trainer", "no_of_nonbodsfarmers_participated", "no_of_bodsfarmers_participated", "farmer_producer_organisation_2", "number_of_fposfarmer_collectives_participated", "topic_of_the_training_conducted", "name_of_the_crop", "name_of_technology_practice_adopted", "area_of_land_on_which_adopted_in_hectares", "no_of_farmers_adopting_the_techpractice", "remarks", "name_of_cropcommodity", "name_of_the_farmers", "area_covered", "is_this_a_bij_1_or_bij_2_village", "subsidised_by_reliance_foundation", "who_provided_the_balance_funds", "farmer_producer_organisation_fpo", "collaborating_agenciesdepartment",]);

    },
    subsidised_by_reliance_foundation: function (frm) {
        reset_field_values(frm, ["if_yes_what_age"])
    },
    technology_practice_demonstrated: function (frm) {
        reset_field_values(frm, ["specify_others"])
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


frappe.realtime.on("before_save_event", function (data) {
    if (data === "Rejected") {
        show_comment_popup();
        // cur_frm.footer.make_comment_box();
    }
});