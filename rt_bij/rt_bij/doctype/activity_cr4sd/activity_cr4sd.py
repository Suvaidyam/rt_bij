# Copyright (c) 2024, suvaidyam and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class ActivityCR4SD(Document):
    def before_save(self):
        self.total_participants = self.total_male + self.total_female
        self.grand_total_of_participants = self.total_male + self.total_female