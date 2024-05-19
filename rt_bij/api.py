import frappe
# import json

@frappe.whitelist(allow_guest=True)
def get_meta():
    print(frappe.get_roles())
    role = f"'Surveyor'"
    sql = f"""
        select
            perm.parent as name,
            perm.read,
            perm.write,
            perm.create,
            perm.delete
        from
            `tabDocPerm` as perm
        where
            perm.role = {role} and (perm.write = 1 or perm.create = 1);
    """
    doctypes = frappe.db.sql(sql, as_dict=True)
    for doctype in doctypes:
        meta = frappe.get_meta(doctype.name)
        doctype['fields'] = [field for field in meta.fields if not field.hidden]
    return doctypes

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
@frappe.whitelist(allow_guest=True)
def get_crs4d_activity_count():
    sql_query = """
        SELECT 
    COUNT(*) AS total_count,
    COALESCE(SUM(CASE WHEN workflow_state = 'Approved' THEN 1 ELSE 0 END), 0) AS approved_count,
    COALESCE(SUM(CASE WHEN workflow_state = 'Pending at SPM' THEN 1 ELSE 0 END), 0) AS pending_spm_count,
    COALESCE(SUM(CASE WHEN workflow_state = 'Rejected' THEN 1 ELSE 0 END), 0) AS rejected_count,
    COALESCE(SUM(CASE WHEN workflow_state = 'Pending at DPM' THEN 1 ELSE 0 END), 0) AS pending_dpm_count
FROM 
    `tabCRS4D activity form`
    """
    result = frappe.db.sql(sql_query, as_dict=True)
    return result[0] if result else None




@frappe.whitelist(allow_guest=True)
def get_crs4d_output_count():
    sql_query = """
        SELECT 
    COUNT(*) AS total_count,
    COALESCE(SUM(CASE WHEN workflow_state = 'Approved' THEN 1 ELSE 0 END), 0) AS approved_count,
    COALESCE(SUM(CASE WHEN workflow_state = 'Pending at SPM' THEN 1 ELSE 0 END), 0) AS pending_spm_count,
    COALESCE(SUM(CASE WHEN workflow_state = 'Rejected' THEN 1 ELSE 0 END), 0) AS rejected_count,
    COALESCE(SUM(CASE WHEN workflow_state = 'Pending at DPM' THEN 1 ELSE 0 END), 0) AS pending_dpm_count
FROM 
    `tabCRS4D output form`
    """
    result = frappe.db.sql(sql_query, as_dict=True)
    return result[0] if result else None




@frappe.whitelist(allow_guest=True)
def get_ivcd_output_count():
    sql_query = """
       SELECT 
    COUNT(*) AS total_count,
    COALESCE(SUM(CASE WHEN workflow_state = 'Approved' THEN 1 ELSE 0 END), 0) AS approved_count,
    COALESCE(SUM(CASE WHEN workflow_state = 'Pending at SPM' THEN 1 ELSE 0 END), 0) AS pending_spm_count,
    COALESCE(SUM(CASE WHEN workflow_state = 'Rejected' THEN 1 ELSE 0 END), 0) AS rejected_count,
    COALESCE(SUM(CASE WHEN workflow_state = 'Pending at DPM' THEN 1 ELSE 0 END), 0) AS pending_dpm_count
FROM 
    `tabIVCD output form`
    """
    result = frappe.db.sql(sql_query, as_dict=True)
    return result[0] if result else None




@frappe.whitelist(allow_guest=True)
def get_ivcd_activity_count():
    sql_query = """
       SELECT 
    COUNT(*) AS total_count,
    COALESCE(SUM(CASE WHEN workflow_state = 'Approved' THEN 1 ELSE 0 END), 0) AS approved_count,
    COALESCE(SUM(CASE WHEN workflow_state = 'Pending at SPM' THEN 1 ELSE 0 END), 0) AS pending_spm_count,
    COALESCE(SUM(CASE WHEN workflow_state = 'Rejected' THEN 1 ELSE 0 END), 0) AS rejected_count,
    COALESCE(SUM(CASE WHEN workflow_state = 'Pending at DPM' THEN 1 ELSE 0 END), 0) AS pending_dpm_count
FROM 
    `tabIVCD activity form`
    """
    result = frappe.db.sql(sql_query, as_dict=True)
    return result[0] if result else None

