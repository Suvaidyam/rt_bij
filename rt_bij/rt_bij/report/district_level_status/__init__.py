import frappe

def get_workflow_counts():
    db = frappe.get_db()
    sql_query = """
        SELECT 
            COUNT(*) AS total_count,
            SUM(CASE WHEN workflow_state = 'Approved' THEN 1 ELSE 0 END) AS approved_count,
            SUM(CASE WHEN workflow_state = 'Pending' THEN 1 ELSE 0 END) AS pending_count,
            SUM(CASE WHEN workflow_state = 'Pending at SPM' THEN 1 ELSE 0 END) AS pending_spm_count,
            SUM(CASE WHEN workflow_state = 'Rejected' THEN 1 ELSE 0 END) AS rejected_count,
            SUM(CASE WHEN workflow_state = 'Pending at DPM' THEN 1 ELSE 0 END) AS pending_dpm_count
        FROM 
            `tabCRS4D output form`
    """
    result = db.sql(sql_query, as_dict=True)
    return result[0] if result else None

workflow_counts = get_workflow_counts()
print(workflow_counts,"???????????????????????????????????????????????????????")
