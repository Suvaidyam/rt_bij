import frappe
from frappe.model.document import Document

class NewUser(Document):
    def before_save(self):
        self.migrate_to_core_user()

    def migrate_to_core_user(self):
        
        core_user = frappe.new_doc("User")
        core_user.update({
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "role_profile_name": self.role,
            "state": self.state,
            "district": self.district,
            "new_password": self.new_password,
        })
        core_user.insert(ignore_permissions=True)
        self.delete()
        frappe.db.commit()
