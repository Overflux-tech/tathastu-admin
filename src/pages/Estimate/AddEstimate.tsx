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
import { generateEstimateNumber } from "../../utils/helper";
import DatePicker from "../../components/form/date-picker";

const AddEstimate = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    customerId: "",
    estimateNumber: "",
    date: null as Date | null,
    state: "",
    items: [
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
  const [errors, setErrors] = useState({});
  const [customers, setCustomers] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    // Example: last saved estimate number
    const fetchLastEstimateNumber = async () => {
      try {
        const res = await api.get(`${endPointApi.getLastEstimateNumber}`);
        const lastNumber = res.data.lastEstimateNumber || "TE2526000";
        const newNumber = generateEstimateNumber(lastNumber);

        setFormData((prev) => ({
          ...prev,
          estimateNumber: newNumber,
        }));
      } catch (err) {
        console.error("Failed to fetch last estimate number", err);
      }
    };
    fetchLastEstimateNumber()
  }, []);

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

  const handleItemChange = (index: number, e: any) => {
  const { name, value } = e.target;

  setFormData((prev: any) => {
    const updatedItems = [...prev.items];

    // update current field
    updatedItems[index] = {
      ...updatedItems[index],
      [name]: value,
    };

    // when item is selected, auto-fill tax
    if (name === "item") {
      const selectedItem = inventoryData.find(
        (inv: any) => inv.id === value
      );

      if (selectedItem) {
        updatedItems[index].taxRate = selectedItem.tax; // auto set tax
      }
    }

    return {
      ...prev,
      items: updatedItems,
    };
  });
};

  //   getById
  useEffect(() => {
    if (!id) return;

    const fetchEstimate = async () => {
      try {
        const res = await api.get(`${endPointApi.getByIdEstimate}/${id}`);

        const data = res.data.data;

        setFormData({
          customerId: data.customerId?.id || "",
          estimateNumber: data.estimateNumber || "",
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
        toast.error("Failed to load estimate ❌");
        console.error(error);
      }
    };

    fetchEstimate();
  }, [id]);

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

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { item: "", name: "", description: "", qty: "", rate: "", taxRate: "" },
      ],
    }));
  };

  // 
  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

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

  const validateForm = () => {
    let newErrors = {};

    if (!formData.customerId) {
      newErrors.customerId = "Customer is required";
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
        customerId: formData.customerId,
        estimateNumber: formData.estimateNumber,
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
        ? `${endPointApi.updateEstimate}/${id}`
        : `${endPointApi.createEstimate}`;

      const res = await api[method](url, payload);

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
    <ComponentCard title={id ? "Edit Estimate" : "Add Estimate"}>
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
          {errors.customerId && (
            <p className="text-red-500">{errors.customerId}</p>
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
          <DatePicker
            id="estimate-date"
            label="Estimate Date"
            placeholder="Select date"
            minDate={new Date()} 
            defaultDate={formData.date}
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

      {/* Items */}
      <div className="mt-6">
        {formData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-5 gap-3 mb-3">
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
                placeholder="description"
                value={item.description}
                onChange={(e) => handleItemChange(index, e)}
              />
              {errors[`description_${index}`] && (
                <p className="text-red-500 text-xs">
                  {errors[`description_${index}`]}
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
