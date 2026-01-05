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
};

export default endPointApi;