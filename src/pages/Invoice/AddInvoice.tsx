// @ts-nocheck
import React, { useState } from "react";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import ComponentCard from "../../components/common/ComponentCard";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const AddInvoice = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: "",
    invoiceNumber: "",
    orderNumber: "",
    date: "",
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

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
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

    const payload = {
      customerName: formData.customerName,
      invoiceNumber: formData.invoiceNumber,
      orderNumber: formData.orderNumber,
      date: formData.date,
      state: formData.state,
      items: formData.items,
    };

    console.log("Invoice Payload:", payload);

    toast.success("Invoice saved successfully ✅");
    navigate("/invoice");
  };

  /* -------------------- JSX -------------------- */

  return (
    <ComponentCard title="Add Invoice">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <Label>Customer Name</Label>
          <Input
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Enter customer name"
          />
          {errors.customerName && <p className="text-red-500">{errors.customerName}</p>}
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
            placeholder="Optional"
          />
        </div>

        <div>
          <Label>Date</Label>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
          {errors.date && <p className="text-red-500">{errors.date}</p>}
        </div>

        <div>
          <Label>State</Label>
          <Input
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
          {errors.state && <p className="text-red-500">{errors.state}</p>}
        </div>
      </div>

      {/* ITEMS */}
      <div className="mt-6">
        {formData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-6 gap-3 mb-3">

            <div>
              <Input
                name="item"
                placeholder="Item"
                value={item.item}
                onChange={(e) => handleItemChange(index, e)}
              />
              {errors[`item_${index}`] && (
                <p className="text-red-500 text-xs">{errors[`item_${index}`]}</p>
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
              <Input
                type="number"
                name="taxRate"
                placeholder="Tax %"
                value={item.taxRate}
                onChange={(e) => handleItemChange(index, e)}
              />
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

        <button onClick={addItem} className="text-blue-600 mt-2">
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
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          Save Invoice
        </button>
      </div>
    </ComponentCard>
  );
};

export default AddInvoice;
