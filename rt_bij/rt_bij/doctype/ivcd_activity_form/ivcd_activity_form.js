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
                        reference_doctype: 'IVCD activity form',
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
frappe.ui.form.on("IVCD activity form", {
    async refresh(frm) {
        apply_filter("output", "option_type", frm, "Output ICVD")
        apply_filter("activity", "option_type", frm, "Activity ICVD")
        apply_filter("activity", "output", frm, frm.doc.output)
        apply_filter("district", "state", frm, frm.doc.state)
        apply_filter("talukatehsil", "district", frm, frm.doc.district)
        apply_filter("gram_panchayat", "block", frm, frm.doc.talukatehsil)
        apply_filter("village", "grampanchayat", frm, frm.doc.gram_panchayat)
        let ws = await callAPI({
            method: `frappe.desk.form.load.getdoc?doctype=IVCD%20activity%20form&name=${frm.doc.name}`,

        })

        // Mapping workflow_logs
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

// Mapping comments
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

    
    

    
`
    
    };
}) || [];

// Combining both workflowLogs and comments
const combinedData = [...workflowLogs, ...comments];

// Sorting combined data by timestamp in descending order
combinedData.sort((a, b) => new Date(b.creation) - new Date(a.creation));

// Rendering combined data
if (combinedData.length > 0) {
    document.getElementById('workflow-table').innerHTML = combinedData.map(e => e.html).join('');
}



    },
    onload(frm) {
        frm.page.sidebar.hide();
        console.log(frm, 'frm');
        $('div.form-footer').hide();
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
        reset_field_values(frm, ["activity", "remarks_explain_the_impact_created", "total_incremental_income_benefit_to_farmer", "savings_in_arthiya_commission_inr_per_quintal", "savings_in_transport_inr_per_quintal", "price_offered_in_the_local_market", "price_offered_inrquintal", "volumes", "value_of_transaction", "no_of_farmers", "name_of_the_commodity", "farmer_producer_organisation_fpo_2", "type", "remark", "no_of_farmers_adopting_the_techpractice", "area_of_land_on_which_adopted", "name_of_technology_practice_adopted", "name_of_technology_practice_adopted", "name_of_the_crop", "remarks", "collaborating_agenciesdepartment", "name_of_the_trainer", "no_of_non_bodsfarmers_participated", "no_of_bodsfarmers_participated", "number_of_fposfarmer_collectives_participated", "farmer_producer_organisation_fpo_1", 'topic_of_the_training_conducted']);

    },
    activity: function () {
        reset_field_values(frm, ["remarks_explain_the_impact_created", "total_incremental_income_benefit_to_farmer", "savings_in_arthiya_commission_inr_per_quintal", "savings_in_transport_inr_per_quintal", "price_offered_in_the_local_market", "price_offered_inrquintal", "volumes", "value_of_transaction", "no_of_farmers", "name_of_the_commodity", "farmer_producer_organisation_fpo_2", "type",])
    },
});

frappe.realtime.on("before_save_event", function (data) {
    if (data === "Rejected") {
        show_comment_popup();
        // cur_frm.footer.make_comment_box();
    }
});
