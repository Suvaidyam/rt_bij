import frappe

@frappe.whitelist(allow_guest=True)
def common_api(filter=None, fields=["*"], doctype_name=None):
    if not doctype_name:
        frappe.throw("doctype_name is required")
    return frappe.db.get_list(doctype_name,
        filters=filter,
        fields=fields,
        page_length=10000,
        ignore_permissions=True
    )


@frappe.whitelist(allow_guest=True)
def get_activities_count():
    pass
    count1 = frappe.db.count("IVCD activity form")
    count2 = frappe.db.count("CRS4D activity form")
    return count1 + count2

@frappe.whitelist(allow_guest=True)
def get_pending_count():
    pass
    count1 = frappe.db.count("CRS4D activity form" , {"workflow_state": ["in", ["Pending at DPM", "Pending at SPM"]]})
    count2 = frappe.db.count("CRS4D output form" , {"workflow_state": ["in", ["Pending at DPM", "Pending at SPM"]]})
    count3 = frappe.db.count("IVCD activity form" , {"workflow_state": ["in", ["Pending at DPM", "Pending at SPM"]]})
    count4 = frappe.db.count("IVCD output form" , {"workflow_state": ["in", ["Pending at DPM", "Pending at SPM"]]})
    
    return count1 + count2 + count3 + count4

@frappe.whitelist(allow_guest=True)
def get_reject_count():
    pass
    count1 = frappe.db.count("CRS4D activity form" , {'workflow_state': 'Rejected'})
    count2 = frappe.db.count("CRS4D output form" , {'workflow_state': 'Rejected'})
    count3 = frappe.db.count("IVCD activity form" , {'workflow_state': 'Rejected'})
    count4 = frappe.db.count("IVCD output form" , {'workflow_state': 'Rejected'})
    
    return count1 + count2 + count3 + count4

