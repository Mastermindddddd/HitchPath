import React from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Package, DollarSign, Users, CreditCard, TrendingUp, Star, PencilLine, Trash } from "lucide-react";
import { overviewData, recentSalesData, topProducts } from "../components/constants";


const DashboardPage = () => {
    return (
        <div className="flex flex-col gap-y-6 p-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { icon: <Package size={26} />, title: "Total Products", value: "25,154", growth: "25%" },
                    { icon: <DollarSign size={26} />, title: "Total Paid Orders", value: "$16,000", growth: "12%" },
                    { icon: <Users size={26} />, title: "Total Customers", value: "15,400k", growth: "15%" },
                    { icon: <CreditCard size={26} />, title: "Sales", value: "12,340", growth: "19%" },
                ].map((item, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div className="p-2 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-600/20">
                                {item.icon}
                            </div>
                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{item.title}</p>
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">{item.value}</p>
                            <span className="flex items-center gap-x-2 text-blue-500 dark:text-blue-600">
                                <TrendingUp size={18} />
                                {item.growth}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Overview Chart */}
            <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-medium text-gray-700 dark:text-gray-300">Overview</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={overviewData}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis dataKey="total" tickFormatter={(value) => `$${value}`} />
                        <Tooltip formatter={(value) => `$${value}`} />
                        <Area type="monotone" dataKey="total" stroke="#2563eb" fill="url(#colorTotal)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Recent Sales */}
            <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-medium text-gray-700 dark:text-gray-300">Recent Sales</h2>
                <div className="space-y-4 overflow-auto max-h-72">
                    {recentSalesData.map((sale) => (
                        <div key={sale.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img src={sale.image} alt={sale.name} className="w-10 h-10 rounded-full" />
                                <div className="ml-4">
                                    <p className="font-medium text-gray-800 dark:text-gray-200">{sale.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{sale.email}</p>
                                </div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">${sale.total}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Orders */}
            <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-medium text-gray-700 dark:text-gray-300">Top Orders</h2>
                <div className="overflow-auto max-h-[500px]">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="text-sm text-gray-500 dark:text-gray-400">
                                <th className="px-4 py-2">#</th>
                                <th className="px-4 py-2">Product</th>
                                <th className="px-4 py-2">Price</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Rating</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topProducts.map((product) => (
                                <tr key={product.number} className="border-t dark:border-gray-700">
                                    <td className="px-4 py-2">{product.number}</td>
                                    <td className="px-4 py-2 flex items-center gap-x-2">
                                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded" />
                                        <span>{product.name}</span>
                                    </td>
                                    <td className="px-4 py-2">${product.price}</td>
                                    <td className="px-4 py-2">{product.status}</td>
                                    <td className="px-4 py-2 flex items-center gap-x-1">
                                        <Star className="text-yellow-500" size={18} />
                                        {product.rating}
                                    </td>
                                    <td className="px-4 py-2 flex items-center gap-x-4">
                                        <button className="text-blue-500 dark:text-blue-600">
                                            <PencilLine size={20} />
                                        </button>
                                        <button className="text-red-500">
                                            <Trash size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        
        </div>
    );
};

export default DashboardPage;
