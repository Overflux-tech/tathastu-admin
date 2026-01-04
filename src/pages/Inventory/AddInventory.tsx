// @ts-nocheck
import React, { useEffect, useState } from "react";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import ComponentCard from "../../components/common/ComponentCard";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

const AddInventory = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        name: "",
        unit: "",
        hsn: "",
        purchase: ""
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e: any) => {
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

    useEffect(() => {
        if (id) {
            getCustomerById();
        }
    }, [id]);

    const getCustomerById = async () => {
        try {
            const res = await axios.get(
                `https://8560e6af88c8.ngrok-free.app/api/v1/inventory/getById/${id}`
            );

            if (res.data) {
                const customer = res.data.data;

                setFormData({
                    name: customer.name || "",
                    unit: customer.unit || "",
                    hsn: customer.hsn || "",
                    purchase: customer.purchase || "",
                });
            }
        } catch (error) {
            console.error(error);
            alert("Failed to load customer ❌");
        }
    };

    const validateForm = () => {
        let newErrors = {};

        // Name
        if (!formData.name.trim()) {
            newErrors.name = "Customer name is required";
        }
        // Name
        if (!formData.unit.trim()) {
            newErrors.unit = "Customer unit is required";
        }
        // Name
        if (!formData.hsn.trim()) {
            newErrors.hsn = "Customer hsn is required";
        }
        // Name
        if (!formData.purchase.trim()) {
            newErrors.purchase = "Customer purchase is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const url = id
                ? `https://8560e6af88c8.ngrok-free.app/api/v1/inventory/update/${id}`
                : `https://8560e6af88c8.ngrok-free.app/api/v1/inventory/create`;

            const method = id ? "put" : "post";

            const res = await axios[method](url, formData);

            if (res.data?.success) {
                toast.success(
                    id
                        ? "Customer updated successfully"
                        : "Customer added successfully"
                );
                navigate("/inventory");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong ❌");
        }
    };

    return (
        <ComponentCard title="Add Inventory">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Inventory Name */}
                <div>
                    <Label>Name</Label>
                    <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter inventory name"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                </div>

                {/* unit */}
                <div>
                    <Label>Unit</Label>
                    <Input
                        type="text"
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        maxLength={10}
                        inputMode="numeric"
                        placeholder="Enter unit"
                    />
                    {errors.unit && (
                        <p className="text-red-500 text-sm mt-1">{errors.unit}</p>
                    )}
                </div>

                {/* HSN */}
                <div>
                    <Label>HSN</Label>
                    <Input
                        type="text"
                        name="hsn"
                        value={formData.hsn}
                        onChange={handleChange}
                        placeholder="Enter Hsn"
                    />
                    {errors.hsn && (
                        <p className="text-red-500 text-sm mt-1">{errors.hsn}</p>
                    )}
                </div>
                {/* purchase */}
                <div>
                    <Label>Purchase</Label>
                    <Input
                        type="text"
                        name="purchase"
                        value={formData.purchase}
                        onChange={handleChange}
                        placeholder="Enter purchase"
                    />
                    {errors.purchase && (
                        <p className="text-red-500 text-sm mt-1">{errors.purchase}</p>
                    )}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-8 border-t pt-5">
                <button className="px-5 py-2 border rounded hover:bg-gray-100"
                    onClick={() => navigate("/inventory")}
                >
                    Cancel
                </button>
                <button
                    className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={handleSubmit}
                >
                    {id ? "Update Customer" : "Save Customer"}
                </button>

            </div>
        </ComponentCard>

    );
};

export default AddInventory;
