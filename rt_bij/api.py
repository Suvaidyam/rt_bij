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
def get_option_list(filter=None,fields=["*"]):
    # filters = json.loads(filter)
    return frappe.db.get_list('Options',
        filters=filter,
        fields=fields,
        page_length=10000,
        ignore_permissions=True
    )
    
@frappe.whitelist(allow_guest=True)
def get_state_list():
    return frappe.db.get_list('State',
        fields = ["name","state_name"],
        page_length=10000,
        ignore_permissions=True
    )

