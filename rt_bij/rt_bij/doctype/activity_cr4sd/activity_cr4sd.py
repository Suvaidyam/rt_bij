# Copyright (c) 2024, suvaidyam and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class ActivityCR4SD(Document):
    def before_save(self):
        # Details of
        self.total_participants = (self.total_male or 0) + (self.total_female or 0)
        self.grand_total_of_participants = (self.total_male or 0) + (self.total_female or 0)
        
        # Water Harvesting Structure Details
        self.total_water_harvesting_capacity = (self.increased_surface_water_storage_capacity or 0) + (self.increased_underground_recharge_capacity or 0)
        
        # Details of Farmer
        self.total_diversification_of_food_basket = (self.no_of_hhs_diversified_food_basket_individual or 0) + (self.no_of_diversification_food_basketcommon or 0)
        self.total_area = (self.no_of_hhs_diversified_food_basket_individual or 0) + (self.no_of_diversification_food_basketcommon or 0)