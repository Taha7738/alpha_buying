import frappe
from frappe import _

@frappe.whitelist()
def get_supplier_quotation(name):
    # get the required element in the supplier quotation doctype
    try:
        doc = frappe.get_doc('Supplier Quotation', name)
    except Exception as e:
        doc = None
        frappe.throw(_('Doctype not found'))
    return doc    


@frappe.whitelist()
def get_material_request(name):
    # get the required element in the material request doctype
    try:
        doc = frappe.get_doc('Material Request', name)
    except Exception as e:
        doc = None
        frappe.throw(_('Doctype not found'))
    return doc        


@frappe.whitelist()
def get_supply_plus(name):
    # get the required element in the material request doctype
    try:
        doc = frappe.get_doc('Supply Plus', name)
    except Exception as e:
        doc = None
        frappe.throw(_('Doctype not found'))
    return doc        