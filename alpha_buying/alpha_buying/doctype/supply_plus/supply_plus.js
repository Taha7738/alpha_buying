frappe.ui.form.on('Supply Plus', {
    refresh(frm) {
        frm.add_custom_button('طلب المواد', () => {
            // here we call the diaglog to choose the material request
            // also we make a call to the api 
            get_material_requests(frm);
        });
    },

});



function get_material_requests(frm) {
    //alert("say hi bug");
    let d = new frappe.ui.Dialog({
        title: 'جلب طلب المواد',
        fields: [
            {
                label: 'جلب طلب المواد',
                fieldname: 'name',
                fieldtype: 'Link',
                options: 'Material Request',
            }
        ],
        primary_action_label: 'جلب',
        primary_action(values) {
            // here we make the API Call for getting the supplier quotation 2 by its name
            frappe.call({
                method: "alpha_buying.api.get_material_request",
                args: values,
                callback: function (r) {
                    // get items stored in the supplier quotation 2
                    let items = r.message.items;
                    let transaction_date = r.message.transaction_date;
                    let select_the_quarter = r.message.select_the_quarter;
                    let select_the_of_requests = r.message.select_the_of_requests;
                    let select_the_destination = r.message.select_the_destination;

                    // loop through the items and add them to child table
                    frm.clear_table('items');
                    items.forEach(item => {
                        frm.add_child('items', {
                            qty: item.qty,
                            uom: item.uom,
                            item_name: item.item_name,
                        });
                    });

                    frm.refresh_field('items');

                    // assign transaction_date to frm
                    frm.set_value("transaction_date", transaction_date);
                    // assign select_the_quarter to frm
                    frm.set_value("select_the_quarter", select_the_quarter);
                    // assign select_the_type_of_request to frm
                    frm.set_value("select_the_of_requests", select_the_of_requests);
                    //assign select_the_destination to frm
                    frm.set_value("select_the_destination", select_the_destination);

                    // refresh frm
                    frm.refresh();

                }
            })
            // frappe call end & hides dialog
            d.hide();
        }
    });
    d.show();

}



// frm: current Supplier Quotation 2 form
// cdt: child DocType 'Supplier Quotation item2'
// cdn: child docname something like (sp100006)
// both cdt cdn are useful for identifying which row triggered

