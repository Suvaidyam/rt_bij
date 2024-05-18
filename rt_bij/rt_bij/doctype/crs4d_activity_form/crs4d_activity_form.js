// Copyright (c) 2024, suvaidyam and contributors
// For license information, please see license.txt

function callAPI(options) {
    return new Promise((resolve, reject) => {
        frappe.call({
            ...options,
            callback: async function (response) {
                resolve(response?.message || response?.value)
            }
        });
    })
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
                args:{
                    reference_doctype: 'CRS4D output form',
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
apply_multiple_filters = (field_name, frm, filter, withoutFilter = false) => {
    frm.fields_dict[field_name].get_query = () => {
        if (withoutFilter) {
            return {
                filters: {},
                page_length: 1000
            };
        }
        return {
            filters: filter,
            page_length: 1000
        };
    }

}

const truncate_field_values = (frm, fields) => {
    fields.forEach(field => {
        frm.set_value(field, '');
    });
}
const integer_length_validator = (value, reqd_length, label) => {
    if (value && String(value).length > reqd_length) {
        frappe.throw(`Count of ${label} can't be more than ${reqd_length} digits!`)
    }
}
frappe.ui.form.on("CRS4D activity form", {
    refresh(frm) {
        apply_filter("district", "state", frm, frm.doc.state)
        apply_filter("talukatehsil", "district", frm, frm.doc.district)
        apply_filter("gram_panchayat", "block", frm, frm.doc.talukatehsil)
        apply_filter("village", "grampanchayat", frm, frm.doc.gram_panchayat)
        apply_filter("villages", "grampanchayat", frm, frm.doc.gram_panchayat)
        apply_filter("output", "option_type", frm, "Output")
        apply_multiple_filters("activity", frm, { "option_type": "Activity", "output": frm.doc.output ?? "Select output" })

    },
    validate(frm) {
        let phone_arr;
        if (frm.doc.phone) {
            phone_arr = frm.doc.phone.split('-')
            if (phone_arr && phone_arr.length == 1) {
                integer_length_validator(phone_arr[0], 10, 'Phone');
            } else if (phone_arr && phone_arr.length == 2) {
                integer_length_validator(phone_arr[1], 10, 'Phone');
            }
        }
        integer_length_validator(frm.doc.total_male, 7, 'Total male');
        integer_length_validator(frm.doc.total_female, 7, 'Total female');
        integer_length_validator(frm.doc.present_surface_water_storage_capacity, 10, 'Present surface water storage capacity');
        integer_length_validator(frm.doc.increased_surface_water_storage_capacity, 10, 'Increased surface water storage capacity');
        integer_length_validator(frm.doc.increased_underground_recharge_capacity, 10, 'Increased underground recharge capacity');
        integer_length_validator(frm.doc.total_water_harvesting_capacity, 10, 'Total water harvesting capacity');
        integer_length_validator(frm.doc.no_of_farmers_benefitted, 10, 'No. of farmers benefitted');
        integer_length_validator(frm.doc.leverage_amount, 10, 'Leverage amount');
        integer_length_validator(frm.doc.no_of_drinking_water_system, 10, 'No. of drinking water system');
        integer_length_validator(frm.doc.total_length_of_pipeline_provisions, 10, 'Total length of pipeline provisions');
        integer_length_validator(frm.doc.drinking_water_system_capacity_created, 10, 'Drinking water system capacity created');
        integer_length_validator(frm.doc.total_households_benefitted, 7, 'Total households benefitted');
        integer_length_validator(frm.doc.leverage_amount2, 10, 'Leverage amount');
        integer_length_validator(frm.doc.area_brought_under_improved_access_to_critical_irrigation, 10, 'Area brought under improved access to critical irrigation');
        integer_length_validator(frm.doc.water_recycle_capacity, 10, 'Water recycle capacity');
        integer_length_validator(frm.doc.noof_households_taken_up_measures, 7, 'No. of households taken up measures');
        integer_length_validator(frm.doc.leverage_amount3, 10, 'Leverage amount');
        integer_length_validator(frm.doc.area, 10, 'Area');
        integer_length_validator(frm.doc.no_of_hhs_diversified_food_basket_individual, 10, 'No. of hhs diversified food basket individual');
        integer_length_validator(frm.doc.no_of_diversification_food_basketcommon, 10, 'No. of diversification food basketcommon');
    },
    output: function (frm) {
        apply_multiple_filters("activity", frm, { "option_type": "Activity", "output": frm.doc.output ?? "Select output" })
        truncate_field_values(frm, ["activity", "type_of_initiative", "gps_coordinates", "upload_water_harvesting_structure_picture", "leverage_amount", "departmentorganisation_collaboratedleverage_resources", "no_of_farmers_benefitted", "area_brought_under_improved_access_to_critical_irrigation", "increased_underground_recharge_capacity", "increased_surface_water_storage_capacity", "present_surface_water_storage_capacity", "condition", "type_of_water_harvesting_structure", "gps_coordinates3", "grey_water_treatment_photo", "name_of_the_departments_and_organizations_converge", "leverage_amount3", "noof_households_taken_up_measures", "water_recycle_capacity", "site_condition", "structure_name", "diversification_of_food_basket_category", "type_of_water_harvesting_structure", "gps_coordinates2", "drinking_water_activity_photo", "department__organization_collaboratedleveraged_resources", "leverage_amount2", "total_households_benefitted", "drinking_water_system_capacity_created", "total_length_of_pipeline_provisions", "no_of_drinking_water_system", "", "gps_coordinates", "upload_water_harvesting_structure_picture", "leverage_amount", "departmentorganisation_collaboratedleverage_resources", "no_of_farmers_benefitted", "area_brought_under_improved_access_to_critical_irrigation", "increased_underground_recharge_capacity", "condition", "increased_surface_water_storage_capacity", "present_surface_water_storage_capacity", "water_budgeting_completed", "crop_water_budgeting_report", "crop_water_budgeting_result", "data_uploaded_on_cwb_tool", "training_topic_purpose", "type_of_participants_involved_in_the_event", "image", "image_description",])
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
    total_male: function (frm) {
        integer_length_validator(frm.doc.total_male, 7, 'Total male');
    },
    total_female: function (frm) {
        integer_length_validator(frm.doc.total_female, 7, 'Total female');
    },
    present_surface_water_storage_capacity: function (frm) {
        integer_length_validator(frm.doc.present_surface_water_storage_capacity, 10, 'Present surface water storage capacity');
    },
    increased_surface_water_storage_capacity: function (frm) {
        integer_length_validator(frm.doc.increased_surface_water_storage_capacity, 10, 'Increased surface water storage capacity');
    },
    increased_underground_recharge_capacity: function (frm) {
        integer_length_validator(frm.doc.increased_underground_recharge_capacity, 10, 'Increased underground recharge capacity');
    },
    total_water_harvesting_capacity: function (frm) {
        integer_length_validator(frm.doc.total_water_harvesting_capacity, 10, 'Total water harvesting capacity');
    },
    no_of_farmers_benefitted: function (frm) {
        integer_length_validator(frm.doc.no_of_farmers_benefitted, 10, 'No. of farmers benefitted');
    },
    leverage_amount: function (frm) {
        integer_length_validator(frm.doc.leverage_amount, 10, 'Leverage amount');
    },
    no_of_drinking_water_system: function (frm) {
        integer_length_validator(frm.doc.no_of_drinking_water_system, 10, 'No. of drinking water system');
    },
    total_length_of_pipeline_provisions: function (frm) {
        integer_length_validator(frm.doc.total_length_of_pipeline_provisions, 10, 'Total length of pipeline provisions');
    },
    drinking_water_system_capacity_created: function (frm) {
        integer_length_validator(frm.doc.drinking_water_system_capacity_created, 10, 'Drinking water system capacity created');
    },
    total_households_benefitted: function (frm) {
        integer_length_validator(frm.doc.total_households_benefitted, 7, 'Total households benefitted');
    },
    leverage_amount2: function (frm) {
        integer_length_validator(frm.doc.leverage_amount2, 10, 'Leverage amount');
    },
    water_recycle_capacity: function (frm) {
        integer_length_validator(frm.doc.water_recycle_capacity, 10, 'Water recycle capacity');
    },
    noof_households_taken_up_measures: function (frm) {
        integer_length_validator(frm.doc.noof_households_taken_up_measures, 7, 'No. of households taken up measures');
    },
    leverage_amount3: function (frm) {
        integer_length_validator(frm.doc.leverage_amount3, 10, 'Leverage amount');
    },
    phone: function (frm) {
        let arr;
        if (frm.doc.phone) {
            arr = frm.doc.phone.split('-')
            if (arr && arr.length == 1) {
                integer_length_validator(arr[0], 10, 'Phone');
            } else if (arr && arr.length == 2) {
                integer_length_validator(arr[1], 10, 'Phone');
            }
        }
    },
    area: function (frm) {
        integer_length_validator(frm.doc.area, 10, 'Area');
    },
    no_of_hhs_diversified_food_basket_individual: function (frm) {
        integer_length_validator(frm.doc.no_of_hhs_diversified_food_basket_individual, 10, 'No. of hhs diversified food basket individual');
    },
    no_of_diversification_food_basketcommon: function (frm) {
        integer_length_validator(frm.doc.no_of_diversification_food_basketcommon, 10, 'No. of diversification food basketcommon');
    },
    area_brought_under_improved_access_to_critical_irrigation: function (frm) {
        integer_length_validator(frm.doc.area_brought_under_improved_access_to_critical_irrigation, 10, 'Area brought under improved access to critical irrigation');
    },

    activity: function (frm) {
        truncate_field_values(frm, ["gps_coordinates3", "grey_water_treatment_photo", "name_of_the_departments_and_organizations_converge", "leverage_amount3", "noof_households_taken_up_measures", "water_recycle_capacity", "site_condition", "structure_name", "diversification_of_food_basket_category", "type_of_water_harvesting_structure", "gps_coordinates2", "drinking_water_activity_photo", "department__organization_collaboratedleveraged_resources", "leverage_amount2", "total_households_benefitted", "drinking_water_system_capacity_created", "total_length_of_pipeline_provisions", "no_of_drinking_water_system", "type_of_initiative", "gps_coordinates", "upload_water_harvesting_structure_picture", "leverage_amount", "departmentorganisation_collaboratedleverage_resources", "no_of_farmers_benefitted", "area_brought_under_improved_access_to_critical_irrigation", "increased_underground_recharge_capacity", "condition", "increased_surface_water_storage_capacity", "present_surface_water_storage_capacity", "water_budgeting_completed", "crop_water_budgeting_report", "crop_water_budgeting_result", "data_uploaded_on_cwb_tool", "training_topic_purpose", "type_of_participants_involved_in_the_event", "image", "image_description",])
    },
    diversification_of_food_basket_category: function (frm) {
        truncate_field_values(frm, ["number_of_farmers", "no_of_hhs_diversified_food_basket_individual", "no_of_diversification_food_basketcommon", "total_diversification_of_food_basket",])
    },

});

frappe.realtime.on("before_save_event", function(data) {
    if(data === "Rejected"){
        show_comment_popup();
        // cur_frm.footer.make_comment_box();
    }
});
