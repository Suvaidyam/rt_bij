let data;
function convertTimestampToPassedTime(timestamp) {
    const currentTime = moment();
    const timestampMoment = moment(timestamp);
    const duration = moment.duration(currentTime.diff(timestampMoment));

    if (duration.asSeconds() < 60) {
        return `${Math.floor(duration.asSeconds())} seconds`;
    } else if (duration.asMinutes() < 60) {
        return `${Math.floor(duration.asMinutes())} minutes`;
    } else if (duration.asHours() < 24) {
        return `${Math.floor(duration.asHours())} hours`;
    } else if (duration.asDays() < 30) {
        return `${Math.floor(duration.asDays())} days`;
    } else {
        const months = Math.floor(duration.asMonths());
        return months === 1 ? '1 month ago' : `${months} months ago`;
    }
}
function formatDate(timestamp) {
    const date = moment(timestamp);
    return date.format('DD MMMM, YYYY');
}
frappe.listview_settings['IVCD activity form'] = {
    refresh: function (listview) {
        $("use.like-icon").hide();
        $(".comment-count").hide();
        $(".frappe-timestamp").hide();
        $(".avatar-small").hide();
        for (let item of data) {
            var pendingSinceElement = document.querySelectorAll(`.list-row-col.ellipsis.hidden-xs [title="Pending Since: ${item.pending_since}"]`);
            if (item.pending_since !== "-") {
                pendingSinceElement.forEach((element) => {
                    element.style.backgroundColor = '#FBE3D8';
                    element.style.borderRadius = '20%';
                    element.style.padding = '6px 12px';
                })
            }
        }
    },
    onload: function (listview) {
        $('.layout-side-section').hide();
        listview.after_render = function () {

            let new_data = listview.data.map((item) => {
                return {
                    ...item, date_of_visit: formatDate(item.creation),
                    pending_since: ["Pending at DPM", "Pending at SPM"].includes(item.workflow_state) ? convertTimestampToPassedTime(item.modified) : "-"
                }
            })
            data = new_data
            listview.data = new_data;

            listview.render_list();
        }
    }
};

eval: (doc.output == 'Output-1' || doc.output == 'Output-2' || doc.output == 'Output-5' || doc.output == 'Output-6' || doc.output == 'Output-7' && doc.activity == 'Activity-1' || doc.activity == 'Activity-2' || doc.activity == 'Activity-3' || doc.activity == 'Activity-4' || doc.activity == 'Activity-6' || doc.activity == 'Activity-9' || doc.activity == 'Activity-11' || doc.activity == 'Activity-12' || doc.activity == 'Activity-14')
eval: (doc.output == "Output-1" || doc.output == "Output-2" || doc.output == "Output-5" || doc.output == "Output-6" || doc.output == "Output-7" && doc.activity == "Activity-1" || doc.activity == "Activity-2" || doc.activity == "Activity-3" || doc.activity == "Activity-4" || doc.activity == "Activity-6" || doc.activity == "Activity-9" || doc.activity == "Activity-11" || doc.activity == "Activity-12" || doc.activity == "Activity-14")
eval: (doc.output == "Output-5" && doc.activity == "Activity-13")

eval: (doc.output == 'Output-5' && doc.activity == 'Activity-13')
eval: (doc.output == 'Output-7' && doc.activity == 'Activity-10')
eval: (doc.output == 'Output-4' && doc.activity == 'Activity-8')
eval: (doc.output == 'Output-3' && doc.activity == 'Activity-7')

eval: (doc.diversification_of_food_basket_category == "Individual" || doc.diversification_of_food_basket_category == "Common" || doc.diversification_of_food_basket_category == "Both")
eval: (doc.diversification_of_food_basket_category == 'Individual' || doc.diversification_of_food_basket_category == 'Common' || doc.diversification_of_food_basket_category == 'Both')