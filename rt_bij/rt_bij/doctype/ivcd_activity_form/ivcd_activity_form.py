# Copyright (c) 2024, suvaidyam and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class IVCDactivityform(Document):
	def before_save(self):
		state = self.workflow_state
		if state == "Rejected":
			frappe.publish_realtime('before_save_event',state)
