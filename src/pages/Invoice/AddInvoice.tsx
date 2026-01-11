// @ts-nocheck
import React, { useEffect, useState } from "react";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import ComponentCard from "../../components/common/ComponentCard";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import endPointApi from "../../utils/endPointApi";
import { api } from "../../utils/axiosInstance";
import { generateInvoiceNumber } from "../../utils/helper";
import DatePicker from "../../components/form/date-picker";

const AddInvoice = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    customerId: "",
    invoiceNumber: "",
    orderNumber: "",
    date: null as Date | null,
    state: "",
    items: [
      {
        item: "",
        description: "",
        qty: "",
        rate: "",
        taxRate: "",
      },
    ],
  });

  const [errors, setErrors] = useState({});
  const [customers, setCustomers] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [estimateData, setEstimateData] = useState(null);

  /* -------------------- HANDLERS -------------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];

    updatedItems[index][name] = value;

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));

    setErrors((prev) => ({
      ...prev,
      [`${name}_${index}`]: "",
    }));
  };

  // Remove any other duplicate declaration

  const handleOrderNumberEnter = async (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const orderNumber = formData.orderNumber.trim();
    if (!orderNumber) return;

     const res = await api.get(`${endPointApi.estimateByNumber}/${orderNumber}`);
      const estimate = res.data.data;
    if (!estimate) {
      toast.error("No estimate found");

      // Clear the order number field if no match
      setFormData((prev) => ({
        ...prev,
        orderNumber: "",
      }));
      return;
    } else {

      setFormData((prev) => ({
        ...prev,
        customerId: estimate.customerId?.id || prev.customerId,
        state: estimate.customerId?.state || prev.state,
        date: estimate.date ? new Date(estimate.date) : prev.date,
        items: estimate.items?.map((i) => ({
          item: i.item?.id || "",
          description: i.description || "",
          qty: i.qty || 0,
          rate: i.rate || 0,
          taxRate: i.taxRate || 0,
        })) || prev.items,
      }));
    }
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { item: "", description: "", qty: "", rate: "", taxRate: "" },
      ],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) return;

    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  /* -------------------- VALIDATION -------------------- */

  const validateForm = () => {
    let newErrors = {};

    if (!formData.customerId) {
      newErrors.customerId = "Customer is required";
    }

    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = "Invoice number is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.state) {
      newErrors.state = "State is required";
    }

    formData.items.forEach((item, index) => {
      if (!item.item) {
        newErrors[`item_${index}`] = "Item name is required";
      }
      if (!item.qty || item.qty <= 0) {
        newErrors[`qty_${index}`] = "Qty must be greater than 0";
      }
      if (!item.rate || item.rate <= 0) {
        newErrors[`rate_${index}`] = "Rate must be greater than 0";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* -------------------- SUBMIT -------------------- */

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        customerId: formData.customerId,
        invoiceNo: formData.invoiceNumber,
        orderNo: formData.orderNumber,
        date: formData.date,
        state: formData.state,
        items: formData.items.map((item) => {
          const selectedItem = inventoryData.find((p) => p.id === item.item);
          return {
            description:
              (selectedItem?.name || "") +
              (item.description ? ` - ${item.description}` : ""),
            item: item.item, // still just the ID
            qty: Number(item.qty),
            rate: Number(item.rate),
            taxRate: Number(item.taxRate),
          };
        }),
      };

      const method = id ? "put" : "post";
      const url = id
        ? `${endPointApi.updateInvoice}/${id}`
        : `${endPointApi.createInvoice}`;

      const res = await api[method](url, payload);

      if (res.data) {
        toast.success(
          id ? "Invoice updated successfully" : "Invoice added successfully"
        );
        navigate("/invoice");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }

  };

  useEffect(() => {
    // Example: last saved estimate number
    const fetchLastInvoiceNumber = async () => {
      try {
        const res = await api.get(`${endPointApi.getLastInvoiceNumber}`);
        const lastNumber = res.data.lastInvoiceNumber || "INV-000";
        const newNumber = generateInvoiceNumber(lastNumber);

        setFormData((prev) => ({
          ...prev,
          invoiceNumber: newNumber,
        }));
      } catch (err) {
        console.error("Failed to fetch last invoice number", err);
      }
    };
    fetchLastInvoiceNumber();
  }, []);

  const getInventory = async () => {
    try {
      // setLoading(true);

      const res = await api.get(`${endPointApi.getAllInventory}`);

      if (res.data?.success) {
        setInventoryData(res.data.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    getInventory();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get(`${endPointApi.getAllCustomer}`);

        setCustomers(res.data.data || []);
      } catch (err) {
        toast.error("Failed to load customers");
      }
    };

    fetchCustomers();
  }, []);

  //   getById
  useEffect(() => {
    if (!id) return;

    const fetchInvoice = async () => {
      try {
        const res = await api.get(`${endPointApi.getByIdInvoice}/${id}`);

        const data = res.data.data;

        setFormData({
          customerId: data.customerId?.id || "",
          invoiceNumber: data.invoiceNo || "",
          orderNumber: data.orderNo || "",
          date: data.date ? new Date(data.date) : null,
          state: data.state || "",
          items: data.items?.length
            ? data.items.map((item) => ({
              item: item.item?.id || "",
              name: item.item?.name || "",
              description: item.description || "",
              qty: item.qty || 0,
              rate: item.rate || 0,
              taxRate: item.taxRate || 0,
            }))
            : [
              {
                name: "",
                item: "",
                description: "",
                qty: 0,
                rate: 0,
                taxRate: 0,
              },
            ],
        });
      } catch (error) {
        toast.error("Failed to load invoice ❌");
        console.error(error);
      }
    };

    fetchInvoice();
  }, [id]);

  return (
    <ComponentCard title="Add Invoice">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <Label>Customer Name</Label>
          <select
            className="w-full border rounded px-3 py-2"
            value={formData.customerId}
            onChange={(e) => {
              const selectedCustomer = customers.find(
                (c) => c.id === e.target.value
              );

              setFormData((prev) => ({
                ...prev,
                customerId: e.target.value, // ✅ store ID
                state: selectedCustomer?.state || "",
              }));
            }}
          >
            <option value="">Select Customer</option>
            {customers.map((cust) => (
              <option key={cust.id} value={cust.id}>
                {cust.name}
              </option>
            ))}
          </select>
          {errors.customerId && <p className="text-red-500">{errors.customerId}</p>}
        </div>

        <div>
          <Label>Invoice Number</Label>
          <Input
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            placeholder="INV-001"
          />
          {errors.invoiceNumber && <p className="text-red-500">{errors.invoiceNumber}</p>}
        </div>

        <div>
          <Label>Order Number</Label>
          <Input
            name="orderNumber"
            value={formData.orderNumber}
            onChange={handleChange}
            onKeyDown={handleOrderNumberEnter}
            placeholder="Optional"
          />
        </div>

        <div>
          <Label>Date</Label>
          <DatePicker
            id="invoice-date"
            placeholder="Select date"
            defaultDate={formData.date ?? undefined}
            onChange={(selectedDates) => {
              setFormData((prev) => ({
                ...prev,
                date: selectedDates[0], // IMPORTANT
              }));
            }}
          />
          {errors.date && <p className="text-red-500">{errors.date}</p>}
        </div>

        <div>
          <Label>State</Label>
          <Input
            name="state"
            value={formData.state}
            onChange={handleChange}
            disabled
          />
          {errors.state && <p className="text-red-500">{errors.state}</p>}
        </div>
      </div>

      {/* ITEMS */}
      <div className="mt-6">
        {formData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-6 gap-3 mb-3">

            <div>
              <select
                name="item"
                value={item.item}
                onChange={(e) => handleItemChange(index, e)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Item</option>
                {inventoryData.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              {errors[`item_${index}`] && (
                <p className="text-red-500 text-xs">
                  {errors[`item_${index}`]}
                </p>
              )}
            </div>

            <div>
              <Input
                name="description"
                placeholder="Description"
                value={item.description}
                onChange={(e) => handleItemChange(index, e)}
              />
            </div>

            <div>
              <Input
                type="number"
                name="qty"
                placeholder="Qty"
                value={item.qty}
                onChange={(e) => handleItemChange(index, e)}
              />
              {errors[`qty_${index}`] && (
                <p className="text-red-500 text-xs">{errors[`qty_${index}`]}</p>
              )}
            </div>

            <div>
              <Input
                type="number"
                name="rate"
                placeholder="Rate"
                value={item.rate}
                onChange={(e) => handleItemChange(index, e)}
              />
              {errors[`rate_${index}`] && (
                <p className="text-red-500 text-xs">{errors[`rate_${index}`]}</p>
              )}
            </div>

            <div>
              <select
                name="taxRate"
                value={item.taxRate}
                onChange={(e) => handleItemChange(index, e)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Tax %</option>
                <option value="5">5%</option>
                <option value="18">18%</option>
              </select>
            </div>

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="flex items-center justify-center w-8 h-8 text-red-500 font-bold rounded-full hover:bg-red-100"
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        <button onClick={addItem} className="primary-color-text mt-2">
          + Add Item
        </button>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end mt-6 gap-3">
        <button
          onClick={() => navigate("/invoice")}
          className="border px-5 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="primary-color text-white px-5 py-2 rounded"
        >
          Save Invoice
        </button>
      </div>
    </ComponentCard>
  );
};

export default AddInvoice;
