import React, { useEffect, useState } from "react";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import ComponentCard from "../../components/common/ComponentCard";
import axios from "axios";
import { useNavigate, useParams } from "react-router";

const AddInventory = () => {
    const navigate = useNavigate();
const { id } = useParams();

    const [formData, setFormData] = useState({
        name: "",
        unit: "",
        hsn: ""
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
            `http://localhost:3688/api/v1/inventory/getById/${id}`
        );
console.log("res",res.data);

        if (res.data) {
            const customer = res.data;

            setFormData({
                name: customer.name || "",
                mobile: customer.mobile || "",
                email: customer.email || "",
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
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
        const url = id
            ? `http://localhost:3688/api/v1/inventory/update/${id}`
            : `http://localhost:3688/api/v1/inventory/create`;

        const method = id ? "put" : "post";

        const res = await axios[method](url, formData);

        if (res.data?.success) {
            alert(
                id
                    ? "Customer updated successfully ✅"
                    : "Customer added successfully ✅"
            );
            navigate("/inventory");
        }
    } catch (error) {
        console.error(error);
        alert("Something went wrong ❌");
    }
};

    return (
        <ComponentCard title="Add Customer">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Customer Name */}
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

                {/* Mobile */}
                <div>
                    <Label>Unit</Label>
                    <Input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        maxLength={10}
                        inputMode="numeric"
                        placeholder="Enter 10-digit mobile number"
                    />
                    {errors.mobile && (
                        <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <Label>HSN</Label>
                    <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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
