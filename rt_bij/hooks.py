app_name = "rt_bij"
app_title = "Rt Bij"
app_publisher = "suvaidyam"
app_description = "a project of reliance foundation"
app_email = "tech@suvaidyam.com"
app_license = "mit"
# required_apps = []
fixtures = [
<<<<<<< HEAD
	"Custom HTML Block",
	"Participant Type",
	"Options",
	"State",
	"District",
	"Block",
	"Grampanchayat",
	"Village",
	"Hamlet"
    ]
=======
    		"Custom HTML Block",
        	"Participant Type",
         "Options"
            ]
>>>>>>> e71528b1b9d463d76d6518134df264ec68e3f518

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/rt_bij/css/rt_bij.css"
# app_include_js = "/assets/rt_bij/js/rt_bij.js"

# include js, css files in header of web template
# web_include_css = "/assets/rt_bij/css/rt_bij.css"
# web_include_js = "/assets/rt_bij/js/rt_bij.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "rt_bij/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "rt_bij/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "rt_bij.utils.jinja_methods",
# 	"filters": "rt_bij.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "rt_bij.install.before_install"
# after_install = "rt_bij.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "rt_bij.uninstall.before_uninstall"
# after_uninstall = "rt_bij.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "rt_bij.utils.before_app_install"
# after_app_install = "rt_bij.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "rt_bij.utils.before_app_uninstall"
# after_app_uninstall = "rt_bij.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "rt_bij.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

permission_query_conditions = {
	"Beneficiary Profiling": "rt_bij.rt_bij.doctype.beneficiary_profiling.query.list_query"
}
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"rt_bij.tasks.all"
# 	],
# 	"daily": [
# 		"rt_bij.tasks.daily"
# 	],
# 	"hourly": [
# 		"rt_bij.tasks.hourly"
# 	],
# 	"weekly": [
# 		"rt_bij.tasks.weekly"
# 	],
# 	"monthly": [
# 		"rt_bij.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "rt_bij.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "rt_bij.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "rt_bij.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["rt_bij.utils.before_request"]
# after_request = ["rt_bij.utils.after_request"]

# Job Events
# ----------
# before_job = ["rt_bij.utils.before_job"]
# after_job = ["rt_bij.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"rt_bij.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

