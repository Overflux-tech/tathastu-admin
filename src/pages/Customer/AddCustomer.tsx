// @ts-nocheck
import React, { useEffect, useState } from "react";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import ComponentCard from "../../components/common/ComponentCard";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

const AddCustomer = () => {
    const navigate = useNavigate();
const { id } = useParams();
    const cityData = [
        // Gujarat
        { city: "Ahmedabad", state: "Gujarat", country: "India" },
        { city: "Surat", state: "Gujarat", country: "India" },
        { city: "Vadodara", state: "Gujarat", country: "India" },
        { city: "Rajkot", state: "Gujarat", country: "India" },
        { city: "Bhavnagar", state: "Gujarat", country: "India" },
        { city: "Jamnagar", state: "Gujarat", country: "India" },

        // Maharashtra
        { city: "Mumbai", state: "Maharashtra", country: "India" },
        { city: "Pune", state: "Maharashtra", country: "India" },
        { city: "Nagpur", state: "Maharashtra", country: "India" },
        { city: "Nashik", state: "Maharashtra", country: "India" },
        { city: "Aurangabad", state: "Maharashtra", country: "India" },
        { city: "Thane", state: "Maharashtra", country: "India" },

        // Rajasthan
        { city: "Jaipur", state: "Rajasthan", country: "India" },
        { city: "Jodhpur", state: "Rajasthan", country: "India" },
        { city: "Udaipur", state: "Rajasthan", country: "India" },
        { city: "Kota", state: "Rajasthan", country: "India" },
        { city: "Ajmer", state: "Rajasthan", country: "India" },

        // Delhi
        { city: "Delhi", state: "Delhi", country: "India" },
        { city: "New Delhi", state: "Delhi", country: "India" },

        // Uttar Pradesh
        { city: "Lucknow", state: "Uttar Pradesh", country: "India" },
        { city: "Kanpur", state: "Uttar Pradesh", country: "India" },
        { city: "Noida", state: "Uttar Pradesh", country: "India" },
        { city: "Ghaziabad", state: "Uttar Pradesh", country: "India" },
        { city: "Agra", state: "Uttar Pradesh", country: "India" },
        { city: "Varanasi", state: "Uttar Pradesh", country: "India" },

        // Madhya Pradesh
        { city: "Bhopal", state: "Madhya Pradesh", country: "India" },
        { city: "Indore", state: "Madhya Pradesh", country: "India" },
        { city: "Gwalior", state: "Madhya Pradesh", country: "India" },
        { city: "Jabalpur", state: "Madhya Pradesh", country: "India" },

        // Karnataka
        { city: "Bengaluru", state: "Karnataka", country: "India" },
        { city: "Mysuru", state: "Karnataka", country: "India" },
        { city: "Mangaluru", state: "Karnataka", country: "India" },
        { city: "Hubli", state: "Karnataka", country: "India" },

        // Tamil Nadu
        { city: "Chennai", state: "Tamil Nadu", country: "India" },
        { city: "Coimbatore", state: "Tamil Nadu", country: "India" },
        { city: "Madurai", state: "Tamil Nadu", country: "India" },
        { city: "Salem", state: "Tamil Nadu", country: "India" },
        { city: "Trichy", state: "Tamil Nadu", country: "India" },

        // Telangana
        { city: "Hyderabad", state: "Telangana", country: "India" },
        { city: "Warangal", state: "Telangana", country: "India" },

        // Andhra Pradesh
        { city: "Visakhapatnam", state: "Andhra Pradesh", country: "India" },
        { city: "Vijayawada", state: "Andhra Pradesh", country: "India" },
        { city: "Guntur", state: "Andhra Pradesh", country: "India" },

        // West Bengal
        { city: "Kolkata", state: "West Bengal", country: "India" },
        { city: "Howrah", state: "West Bengal", country: "India" },
        { city: "Durgapur", state: "West Bengal", country: "India" },

        // Punjab
        { city: "Chandigarh", state: "Punjab", country: "India" },
        { city: "Amritsar", state: "Punjab", country: "India" },
        { city: "Ludhiana", state: "Punjab", country: "India" },
        { city: "Jalandhar", state: "Punjab", country: "India" },

        // Haryana
        { city: "Gurgaon", state: "Haryana", country: "India" },
        { city: "Faridabad", state: "Haryana", country: "India" },
        { city: "Panipat", state: "Haryana", country: "India" },

        // Kerala
        { city: "Kochi", state: "Kerala", country: "India" },
        { city: "Trivandrum", state: "Kerala", country: "India" },
        { city: "Kozhikode", state: "Kerala", country: "India" },

        // Bihar
        { city: "Patna", state: "Bihar", country: "India" },
        { city: "Gaya", state: "Bihar", country: "India" },

        // Odisha
        { city: "Bhubaneswar", state: "Odisha", country: "India" },
        { city: "Cuttack", state: "Odisha", country: "India" },

        // Assam
        { city: "Guwahati", state: "Assam", country: "India" },

        // Goa
        { city: "Panaji", state: "Goa", country: "India" },
        { city: "Margao", state: "Goa", country: "India" },
    ];

    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        email: "",
        gst_number: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
    });
    const [errors, setErrors] = useState({});

    const handleCityChange = (e: any) => {
        const selectedCity = e.target.value;

        const result = cityData.find(
            (item) => item.city === selectedCity
        );

        setFormData((prev) => ({
            ...prev,
            city: selectedCity,
            state: result?.state || "",
            country: result?.country || "",
        }));

        // Clear city error immediately
        setErrors((prev) => ({
            ...prev,
            city: "",
        }));
    };

const handleChange = (e: any) => {
    const { name, value } = e.target;

    // Allow only numbers
    if (name === "mobile" || name === "pincode") {
        if (!/^\d*$/.test(value)) return;

        // Limit length
        if (name === "mobile" && value.length > 10) return;
        if (name === "pincode" && value.length > 6) return;
    }

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
            `http://localhost:3688/api/v1/customer/getById/${id}`
        );
console.log("res",res.data);

        if (res.data) {
            const customer = res.data;

            setFormData({
                name: customer.name || "",
                mobile: customer.mobile || "",
                email: customer.email || "",
                gst_number: customer.gst_number || "",
                address: customer.address || "",
                city: customer.city || "",
                state: customer.state || "",
                country: customer.country || "",
                pincode: customer.pincode || "",
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

        // Mobile
        if (!formData.mobile) {
            newErrors.mobile = "Mobile number is required";
        } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
            newErrors.mobile = "Mobile number must be 10 digits";
        }

        // Email
        if (!formData.email) {
            newErrors.email = "Email address is required";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            newErrors.email = "Enter a valid email address";
        }

        // GST
        if (!formData.gst_number) {
            newErrors.gst_number = "GST number is required";
        } else if (
            !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
                formData.gst_number
            )
        ) {
            newErrors.gst_number = "Enter a valid GST number";
        }

        // City
        if (!formData.city) {
            newErrors.city = "Please select a city";
        }

        // Pincode
        if (!formData.pincode) {
            newErrors.pincode = "Pincode is required";
        } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
            newErrors.pincode = "Pincode must be 6 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
        const url = id
            ? `http://localhost:3688/api/v1/customer/update/${id}`
            : `http://localhost:3688/api/v1/customer/create`;

        const method = id ? "put" : "post";

        const res = await axios[method](url, formData);

        if (res.data?.success) {
            toast.success(
                    id
                      ? "Customer updated successfully"
                      : "Customer added successfully"
                  );
            navigate("/customer");
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
                    <Label>Customer Name</Label>
                    <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter customer full name"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                </div>

                {/* Mobile */}
                <div>
                    <Label>Mobile Number</Label>
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
                    <Label>Email Address</Label>
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

                {/* GST */}
                <div>
                    <Label>GST Number</Label>
                    <Input
                        type="text"
                        name="gst_number"
                        value={formData.gst_number}
                        onChange={handleChange}
                        placeholder="Enter GSTIN (if applicable)"
                    />
                    {errors.gst_number && (
                        <p className="text-red-500 text-sm mt-1">{errors.gst_number}</p>
                    )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                    <Label>Address</Label>
                    <Input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter complete address"
                    />
                </div>

                {/* City */}
                <div>
                    <Label>City</Label>
                    <select
                        value={formData.city}
                        onChange={handleCityChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select city</option>
                        {cityData.map((item, index) => (
                            <option key={index} value={item.city}>
                                {item.city}
                            </option>
                        ))}
                    </select>{errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                </div>

                {/* State */}
                <div>
                    <Label>State</Label>
                    <Input
                        type="text"
                        name="state"
                        value={formData.state}
                        placeholder="Auto-filled based on city"
                        readOnly
                    />
                </div>

                {/* Country */}
                <div>
                    <Label>Country</Label>
                    <Input
                        type="text"
                        name="country"
                        value={formData.country}
                        placeholder="Auto-filled based on city"
                        readOnly
                    />
                </div>

                {/* Pincode */}
                <div>
                    <Label>Pincode</Label>
                    <Input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        maxLength={6}
                        inputMode="numeric"
                        placeholder="Enter area pincode"
                    />
                    {errors.pincode && (
                        <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                    )}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-8 border-t pt-5">
                <button className="px-5 py-2 border rounded hover:bg-gray-100"
                 onClick={() => navigate("/customer")}
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

export default AddCustomer;
