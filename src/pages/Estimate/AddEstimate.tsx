// @ts-nocheck
import React, { useEffect, useState } from "react";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import ComponentCard from "../../components/common/ComponentCard";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import endPointApi from "../../utils/endPointApi";
import { api } from "../../utils/axiosInstance";

const AddEstimate = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    customerName: "",
    estimateNumber: "",
    date: "",
    state: "",
    items: [
      {
        item: "",
        description: "",
        qty: 0,
        rate: 0,
        taxRate: 0,
      },
    ],
  });

  const [errors, setErrors] = useState({});
  const [customers, setCustomers] = useState([]);

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
  };

  //   getById
  useEffect(() => {
    if (!id) return;

    const fetchEstimate = async () => {
      try {
        const res = await api.get(`${endPointApi.getByIdEstimate}/${id}`);

        const data = res.data.data;

        setFormData({
          customerName: data.customerName || "",
          estimateNumber: data.estimateNumber || "",
          date: data.date ? data.date.split("T")[0] : "",
          state: data.state || "",
          items: data.items?.length
            ? data.items.map((item) => ({
                item: item.item || "",
                description: item.description || "",
                qty: item.qty || 0,
                rate: item.rate || 0,
                taxRate: item.taxRate || 0,
              }))
            : [
                {
                  item: "",
                  description: "",
                  qty: 0,
                  rate: 0,
                  taxRate: 0,
                },
              ],
        });
      } catch (error) {
        toast.error("Failed to load estimate ❌");
        console.error(error);
      }
    };

    fetchEstimate();
  }, [id]);

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
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  console.log('customers', customers)
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3688/api/v1/customer/getall"
        );
        setCustomers(res.data.data || []);
      } catch (err) {
        toast.error("Failed to load customers");
      }
    };

    fetchCustomers();
  }, []);

  const validateForm = () => {
    let newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    }

    if (!formData.estimateNumber.trim()) {
      newErrors.estimateNumber = "Estimate number is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.state) {
      newErrors.state = "State is required";
    }

    formData.items.forEach((item, index) => {
      if (!item.item) {
        newErrors[`item_${index}`] = "Item name required";
      }
      if (!item.qty || item.qty <= 0) {
        newErrors[`qty_${index}`] = "Quantity must be greater than 0";
      }
      if (!item.rate || item.rate <= 0) {
        newErrors[`rate_${index}`] = "Rate must be greater than 0";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // 🔁 Frontend → Backend payload mapping
      const payload = {
        customerName: formData.customerName,
        estimateNumber: formData.estimateNumber,
        date: formData.date,
        state: formData.state,
        items: formData.items.map((item) => ({
          description:
            item.item + (item.description ? ` - ${item.description}` : ""),
          item: "test",
          qty: Number(item.qty),
          rate: Number(item.rate),
          taxRate: Number(item.taxRate),
        })),
      };

      const method = id ? "put" : "post";
      const url = id
        ? `${endPointApi.updateEstimate}/${id}`
        : `${endPointApi.createEstimate}`;

      const res = await api[method](url, payload);
      console.log("dsdsdsd");

      if (res.data) {
        toast.success(
          id ? "Estimate updated successfully" : "Estimate added successfully"
        );
        navigate("/estimate");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <ComponentCard title="Add Estimate">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Customer Name</Label>

          <select
            className="w-full border rounded px-3 py-2"
            value={formData.customerName}
            onChange={(e) => {
              const selectedCustomer = customers.find(
                (c) => c.customerName === e.target.value
              );

              setFormData((prev) => ({
                ...prev,
                customerName: e.target.value,
                state: selectedCustomer?.state || "",
              }));
            }}
          >
            <option value="">Select Customer</option>
            {customers.map((cust) => (
              <option key={cust._id} value={cust.name}>
                {cust.name}
              </option>
            ))}
          </select>

          {errors.customerName && (
            <p className="text-red-500">{errors.customerName}</p>
          )}
        </div>

        <div>
          <Label>Estimate Number</Label>
          <Input
            name="estimateNumber"
            value={formData.estimateNumber}
            onChange={handleChange}
            placeholder="EST-001"
          />
          {errors.estimateNumber && (
            <p className="text-red-500">{errors.estimateNumber}</p>
          )}
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
          <Input name="state" value={formData.state} onChange={handleChange} />
          {errors.state && <p className="text-red-500">{errors.state}</p>}
        </div>
      </div>

      {/* Items */}
      <div className="mt-6">
        {formData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-5 gap-3 mb-3">
            <div>
              <Input
                name="item"
                placeholder="Item"
                value={item.item}
                onChange={(e) => handleItemChange(index, e)}
              />
              {errors[`item_${index}`] && (
                <p className="text-red-500 text-xs">
                  {errors[`item_${index}`]}
                </p>
              )}
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
                <p className="text-red-500 text-xs">
                  {errors[`rate_${index}`]}
                </p>
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
                className="text-red-500 font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        <button onClick={addItem} className="primary-color-text">
          + Add Item
        </button>
      </div>

      <div className="flex justify-end mt-6 gap-3">
        <button
          onClick={() => navigate("/estimate")}
          className="border px-5 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="primary-color text-white px-5 py-2 rounded"
        >
          Save Estimate
        </button>
      </div>
    </ComponentCard>
  );
};

export default AddEstimate;
