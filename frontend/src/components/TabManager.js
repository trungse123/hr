import React, { useState } from 'react';

// Đây là React Component chứa toàn bộ hệ thống Tab của bạn
function TabManager() {
    // Sử dụng State để theo dõi xem tab nào đang được chọn. Mặc định là 'chamcong'.
    const [activeTab, setActiveTab] = useState('chamcong');

    // Dữ liệu cho các tab, bạn có thể thêm/bớt dễ dàng
    const tabs = [
        { id: 'chamcong', label: 'Chấm công' },
        { id: 'nhiemvu', label: 'Nhiệm vụ' },
        { id: 'sukien', label: 'Sự kiện' },
        { id: 'nhanvien', label: 'Nhân viên' },
        { id: 'xuatcong', label: 'Xuất công' },
    ];

    // Hàm render nội dung tương ứng với tab được chọn
    const renderTabContent = () => {
        switch (activeTab) {
            case 'chamcong':
                return (
                    // BẠN CÓ THỂ ĐẶT LẠI FORM CHẤM CÔNG CỦA MÌNH VÀO ĐÂY
                    <div className="w-full max-w-sm mx-auto text-center">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Chấm công</h2>
                        <p className="text-slate-500 mb-6">Nhập mã nhân viên để chấm công vào hoặc chấm công ra.</p>
                        <input type="text" placeholder="Nhập mã nhân viên" className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4" />
                        <div className="flex gap-4">
                            <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-md hover:bg-indigo-700 transition-colors">Chấm công vào</button>
                            <button className="w-full bg-orange-500 text-white font-bold py-3 rounded-md hover:bg-orange-600 transition-colors">Chấm công ra</button>
                        </div>
                    </div>
                );
            case 'nhiemvu':
                return <div><h3 className="text-xl font-semibold text-gray-800">Nội dung tab Nhiệm vụ</h3><p className="text-gray-600">Đây là nơi hiển thị các nhiệm vụ được giao.</p></div>;
            case 'sukien':
                return <div><h3 className="text-xl font-semibold text-gray-800">Nội dung tab Sự kiện</h3><p className="text-gray-600">Đây là nơi hiển thị các sự kiện của công ty.</p></div>;
            case 'nhanvien':
                 return <div><h3 className="text-xl font-semibold text-gray-800">Nội dung tab Nhân viên</h3><p className="text-gray-600">Đây là nơi hiển thị danh sách nhân viên.</p></div>;
            case 'xuatcong':
                 return <div><h3 className="text-xl font-semibold text-gray-800">Nội dung tab Xuất công</h3><p className="text-gray-600">Đây là nơi để xuất file chấm công.</p></div>;
            default:
                return null;
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
            {/* Các nút bấm để chuyển Tab */}
            <div className="mb-6 border-b border-gray-200">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                    {tabs.map((tab) => (
                        <li key={tab.id} className="mr-2">
                            <button
                                onClick={() => setActiveTab(tab.id)}
                                className={`inline-block p-4 border-b-2 rounded-t-lg transition-colors duration-300 ${
                                    activeTab === tab.id
                                        ? 'text-indigo-600 border-indigo-600' // Kiểu của tab active
                                        : 'border-transparent hover:text-gray-600 hover:border-gray-300' // Kiểu của tab inactive
                                }`}
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Nội dung của các Tab */}
            <div className="p-4 rounded-lg bg-gray-50 min-h-[300px]">
                {renderTabContent()}
            </div>
        </div>
    );
}

export default TabManager;