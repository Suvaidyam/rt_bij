function convertTimestampToPassedTime(timestamp) {
    const currentTime = moment();
    const timestampMoment = moment(timestamp);
    const duration = moment.duration(currentTime.diff(timestampMoment));

    if (duration.asSeconds() < 60) {
        return `${Math.floor(duration.asSeconds())} s`;
    } else if (duration.asMinutes() < 60) {
        return `${Math.floor(duration.asMinutes())} m`;
    } else if (duration.asHours() < 24) {
        return `${Math.floor(duration.asHours())} h`;
    } else if (duration.asDays() < 30) {
        return `${Math.floor(duration.asDays())} d`;
    } else {
        const months = Math.floor(duration.asMonths());
        return months === 1 ? '1 month ago' : `${months} months ago`;
    }
}
frappe.listview_settings['CRS4D activity form'] = {
    onload: function (listview) {
        console.log(listview)
        $('.layout-side-section').hide();
        listview.after_render = function () {
            // $('.like-icon').hide();
            let icon = $('[title="Liked by me"]')
            console.log(icon)
            let new_data = listview.data.map((item) => {
                return {
                    ...item, date_of_visit: frappe.datetime.str_to_user(item.creation).split(" ")[0],
                    pending_since: convertTimestampToPassedTime(item.creation)
                }
            })
            listview.data = new_data;
            listview.render_list();
            console.log(listview);
        }
    }
};