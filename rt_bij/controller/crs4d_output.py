import frappe

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