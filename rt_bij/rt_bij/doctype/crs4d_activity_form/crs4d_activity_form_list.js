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
frappe.listview_settings['CRS4D activity form'] = {
    refresh: function (listview) {
        $("use.like-icon").hide();
        $(".comment-count").hide();
        $(".frappe-timestamp").hide();
        $(".avatar-small").hide();
    },
    onload: function (listview) {
        $('.layout-side-section').hide();
        listview.after_render = function () {
            let new_data = listview.data.map((item) => {
                return {
                    ...item, date_of_visit: frappe.datetime.str_to_user(item.creation).split(" ")[0],
                    pending_since: ["Pending at DPM", "Pending at SPM"].includes(item.workflow_state) ? convertTimestampToPassedTime(item.modified) : "-"
                }
            })
            listview.data = new_data;
            listview.render_list();
        }
    }
};