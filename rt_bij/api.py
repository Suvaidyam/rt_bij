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
        doctype['fields'] = meta.fields
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