export interface EndPointApi {
    login: string;
    register: string;
    logout: string;

    //Customer
    getAllCustomer?: string;
    getByIdCustomer?: string;
    createCustomer?: string;
    updateCustomer?: string;
    deleteCustomer?: string;

    //Inventory
    getAllInventory?: string;
    getByIdInventory?: string;
    createInventory?: string;
    updateInventory?: string;
    deleteInventory?: string;
    uploadExcelInventory?: string;

    //Estimate
    getAllEstimate?: string;
    getByIdEstimate?: string;
    createEstimate?: string;
    updateEstimate?: string;
    deleteEstimate?: string;
    getLastEstimateNumber?: string;

    //Invoice
    getAllInvoice?: string;
    getByIdInvoice?: string;
    createInvoice?: string;
    updateInvoice?: string;
    deleteInvoice?: string;
    getLastInvoiceNumber?: string;
    estimateByNumber?: string
}

// Define and export the API endpoint object
const endPointApi: EndPointApi = {
    login: 'auth/login',
    register: 'auth/register',
    logout: 'auth/logout',

    //Blogs
    getAllCustomer: 'customer/getall',
    getByIdCustomer: 'customer/getById',
    createCustomer: 'customer/create',
    updateCustomer: 'customer/update',
    deleteCustomer: 'customer/delete', 

    //Inventory
    getAllInventory: 'inventory/getall',
    getByIdInventory: 'inventory/getById',
    createInventory: 'inventory/create',
    updateInventory: 'inventory/update',
    deleteInventory: 'inventory/delete', 
    uploadExcelInventory: 'inventory/upload-excel', 

    //Estimate
    getAllEstimate: 'estimate/getall',
    getByIdEstimate: 'estimate/getById',
    createEstimate: 'estimate/create',
    updateEstimate: 'estimate/update',
    deleteEstimate: 'estimate/delete', 
    getLastEstimateNumber: 'estimate/last-estimate-number',
    estimateByNumber: 'estimate/by-number',

    //Invoice
    getAllInvoice: 'invoice/getall',
    getByIdInvoice: 'invoice/getById',
    createInvoice: 'invoice/create',
    updateInvoice: 'invoice/update',
    deleteInvoice: 'invoice/delete',
    getLastInvoiceNumber: 'invoice/last-invoice-number',
};

export default endPointApi;