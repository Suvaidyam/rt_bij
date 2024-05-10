import frappe

def list_query(user):
    if not user:
        user = frappe.session.user
    if "State User" in frappe.get_roles(user) and ("Administrator" not in frappe.get_roles(user)):
        usr =  frappe.get_doc('User', user)
        if usr is not None:
            return """district_level_status = 'Accepted'"""