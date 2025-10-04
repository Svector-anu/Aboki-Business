// src/components/OfframpPage.jsx
import { useState, useEffect } from 'react';

export default function OfframpPage() {
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('order-history');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(3);
    const [totalPages, setTotalPages] = useState(95);
    const [totalOrders, setTotalOrders] = useState(964);

    // TODO: Replace with real API call
    // API endpoint: GET /api/v1/business/offramp/orders
    useEffect(() => {
        const fetchOrders = async () => {
            // TODO: Implement real API integration
            // MOCK DATA for now
            const mockOrders = [
                {
                    date: 'Tuesday, September 23, 2025',
                    transactions: [
                        { id: 1, amount: '10.00', token: 'USDC', status: 'refunded', destination: 'OPay', description: 'Token to NGN Swap', network: 'Base', feeAmount: '+0.00', feeToken: 'USDC' },
                        { id: 2, amount: '14.66', token: 'USDC', status: 'expired', destination: 'Wema Bank', description: 'Token to NGN Swap', network: 'Base', feeAmount: '+0.00', feeToken: 'USDC' },
                        { id: 3, amount: '14.67', token: 'USDC', status: 'expired', destination: 'Wema Bank', description: 'Token to NGN Swap', network: 'Base', feeAmount: '+0.00', feeToken: 'USDC' },
                        { id: 4, amount: '14.87', token: 'USDC', status: 'expired', destination: 'Wema Bank', description: 'Token to NGN Swap', network: 'Base', feeAmount: '+0.00', feeToken: 'USDC' },
                        { id: 5, amount: '14.67', token: 'USDC', status: 'expired', destination: 'Wema Bank', description: 'Token to NGN Swap', network: 'Base', feeAmount: '+0.00', feeToken: 'USDC' },
                        { id: 6, amount: '14.68', token: 'USDC', status: 'expired', destination: 'Wema Bank', description: 'Token to NGN Swap', network: 'Base', feeAmount: '+0.00', feeToken: 'USDC' },
                        { id: 7, amount: '14.66', token: 'USDC', status: 'expired', destination: 'Wema Bank', description: 'Token to NGN Swap', network: 'Base', feeAmount: '+0.00', feeToken: 'USDC' }
                    ]
                }
            ];

            setOrders(mockOrders);
            setLoading(false);
        };

        fetchOrders();
    }, [currentPage]);

    const getStatusBadge = (status) => {
        const styles = {
            refunded: 'bg-blue-100 text-blue-700',
            expired: 'bg-red-100 text-red-700',
            completed: 'bg-green-100 text-green-700',
            pending: 'bg-yellow-100 text-yellow-700'
        };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-20">
            <div className="mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    Offramp
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Convert crypto to Nigerian Naira
                </p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 px-6">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'overview'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('order-history')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'order-history'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Order History
                        </button>
                        <button
                            onClick={() => setActiveTab('docs')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'docs'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Docs
                        </button>
                    </nav>
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === 'order-history' && (
                        <div>
                            {orders.map((dateGroup, idx) => (
                                <div key={idx} className="mb-8">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-4">{dateGroup.date}</h3>
                                    <div className="space-y-3">
                                        {dateGroup.transactions.map((tx) => (
                                            <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                        <span className="text-lg">💰</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <span className="font-semibold text-gray-900">{tx.amount} {tx.token}</span>
                                                            {getStatusBadge(tx.status)}
                                                        </div>
                                                        <p className="text-sm text-gray-600">{tx.destination}</p>
                                                        <p className="text-xs text-gray-500">{tx.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-gray-900">{tx.feeAmount} {tx.feeToken}</p>
                                                        <p className="text-xs text-gray-500">{tx.network}</p>
                                                    </div>
                                                    <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">View details</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Pagination */}
                            <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
                                <p className="text-sm text-gray-600">Showing {((currentPage - 1) * 20) + 1} to {currentPage * 20} of {totalOrders} results</p>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50">
                                        Previous
                                    </button>
                                    <button onClick={() => setCurrentPage(1)} className={`w-8 h-8 text-sm font-medium rounded-lg ${currentPage === 1 ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>1</button>
                                    <button onClick={() => setCurrentPage(2)} className={`w-8 h-8 text-sm font-medium rounded-lg ${currentPage === 2 ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>2</button>
                                    <button onClick={() => setCurrentPage(3)} className={`w-8 h-8 text-sm font-medium rounded-lg ${currentPage === 3 ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>3</button>
                                    <span className="px-2 text-gray-500">...</span>
                                    <button onClick={() => setCurrentPage(93)} className="w-8 h-8 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">93</button>
                                    <button onClick={() => setCurrentPage(94)} className="w-8 h-8 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">94</button>
                                    <button onClick={() => setCurrentPage(95)} className="w-8 h-8 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">95</button>
                                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'overview' && (
                        <div className="py-12 text-center">
                            <p className="text-gray-600">Overview content coming soon</p>
                        </div>
                    )}

                    {activeTab === 'docs' && (
                        <div className="py-12 text-center">
                            <p className="text-gray-600">Documentation coming soon</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}