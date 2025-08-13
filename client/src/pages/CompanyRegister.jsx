import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getCompanyProfile, registerCompany } from "../services/companyServices";

export default function CompanyRegister() {
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  // ✅ Query for profile
  const { data, isLoading } = useQuery({
    queryKey: ["companyProfile"],
    queryFn: () => getCompanyProfile(token),
    enabled: !!token,
    retry: false,
  });

  // ✅ Mutation for register
  const mutation = useMutation({
    mutationFn: (formData) => registerCompany({ token, data: formData }),
    onSuccess: () => navigate("/company/dashboard"),
  });

  useEffect(() => {
    if (data) navigate("/company/dashboard");
  }, [data, navigate]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white rounded shadow-md w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Register Your Company</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit((f) => mutation.mutate(f))}>
        <input {...register("name")} placeholder="Company Name" className="border p-2 rounded" />
        <input {...register("address")} placeholder="Address" className="border p-2 rounded" />
        <input {...register("city")} placeholder="City" className="border p-2 rounded" />
        <input {...register("state")} placeholder="State" className="border p-2 rounded" />
        <input {...register("country")} placeholder="Country" className="border p-2 rounded" />
        <input {...register("postal_code")} placeholder="Postal Code" className="border p-2 rounded" />
        <input {...register("website")} placeholder="Website" className="border p-2 rounded" />
        <input {...register("industry")} placeholder="Industry" className="border p-2 rounded" />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
