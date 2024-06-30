frappe.ui.form.on('Supply Notice', {

    refresh(frm) {
        // your code here
        // frappe custom button
        frm.add_custom_button('التسعيرة من قبل المورد', () => {
            // get supplier quotation and add its items to the form child table
            get_supplier_quotation_items(frm);
            // end executing
        });
    },
});



function get_supplier_quotation_items(frm) {
            
    // frappe dialog
    let d = new frappe.ui.Dialog({
        title: 'جلب التسعيرة المقدمة من المورد',
        fields: [
            {
                label: 'التسعيرة المقدمة من المورد',
                fieldname: 'name',
                fieldtype: 'Link',
                options: 'Supplier Quotation',
            }
        ],
        // size: 'small', // small, large, extra-large 
        primary_action_label: 'اجلب',
        primary_action(values) {
            // here we make the API Call for getting the supplier quotation 2 by its name
            frappe.call({
                method: "alpha_buying.api.get_supplier_quotation",
                args: values,
                callback: function (r) {
                    // get items stored in the supplier quotation 2
                    let items = r.message.items;
                    let supplier = r.message.supplier;
                    //let supplier_name = r.message.supplier_name;
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
                            rate: item.rate,
                            amount: item.amount,
                            trade_name: item.trade_name,
                            manufacture_company: item.manufacture_company,
                            country_of_origin: item.country_of_origin,
                            expiry_date: item.expiry_date,
                            comments: item.comments,
                        });
                    });

                    frm.refresh_field('items');
                    // assign supplier name to frm
                    frm.set_value("supplier", supplier);
                    // assign transaction_date to frm
                    frm.set_value("transaction_date", transaction_date);
                    // assign select_the_quarter to frm
                    frm.set_value("select_the_quarter", select_the_quarter);
                    // assign select_the_type_of_request to frm
                    frm.set_value("select_the_of_requests", select_the_of_requests);
                    // assign select_the_destination to frm
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

// frappe.ui.form.on('Supplier Quotation Item', 'rate', function (frm, cdt, cdn) {
//     // getting the row the user is on at the moment through the use of locals array
//     let item = locals[cdt][cdn];
//     let item_amount = item.rate * item.qty;
//     item.amount = item_amount;
//     frm.refresh_field('items');
// });


frappe.ui.form.on('Supplier Quotation Item', {
    rate: function(frm, cdt, cdn) {
        calculateTotalAmount(frm, cdt, cdn);
    },
    qty: function(frm, cdt, cdn) {
        calculateTotalAmount(frm, cdt, cdn);
    }
});

function calculateTotalAmount(frm, cdt, cdn) {
    let item = locals[cdt][cdn];
    let item_amount = flt(item.rate) * flt(item.qty);
    item.amount = item_amount;
    frm.refresh_field('items');
}