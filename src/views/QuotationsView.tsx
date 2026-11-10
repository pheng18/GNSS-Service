import React, { useState } from 'react';
import {
  ShoppingCart,
  Search,
  Plus,
  ArrowLeft,
  Trash2,
  FileText,
  Printer,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Quotation, QuotationItem } from '../types';

export const QuotationsView: React.FC = () => {
  const {
    quotations,
    selectedQuotation,
    selectQuotation,
    addQuotation
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [validityFilter, setValidityFilter] = useState('ທັງໝົດ');
  const [showAddModal, setShowAddModal] = useState(false);

  // New quotation states
  const [customerName, setCustomerName] = useState('');
  const [validity, setValidity] = useState('30 ວັນ');
  const [terms, setTerms] = useState(
    'ລາຄານີ້ລວມຄ່າຂົນສົ່ງພາຍໃນນະຄອນຫຼວງວຽງຈັນ. ສໍາລັບຕ່າງແຂວງຈະມີຄ່າໃຊ້ຈ່າຍເພີ່ມເຕີມຕາມໄລຍະທາງຕົວຈິງ.'
  );

  // Dynamic line items builder
  const [itemsList, setItemsList] = useState<QuotationItem[]>([]);
  const [tempDesc, setTempDesc] = useState('');
  const [tempDetails, setTempDetails] = useState('');
  const [tempQty, setTempQty] = useState('1');
  const [tempPrice, setTempPrice] = useState('');

  const handleAddItem = () => {
    if (!tempDesc.trim() || !tempPrice.trim()) return;
    const qty = parseInt(tempQty) || 1;
    const price = parseFloat(tempPrice) || 0;
    const newItem: QuotationItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      description: tempDesc.trim(),
      details: tempDetails.trim(),
      qty,
      unitPrice: price
    };
    setItemsList((prev) => [...prev, newItem]);
    setTempDesc('');
    setTempDetails('');
    setTempQty('1');
    setTempPrice('');
  };

  const handleRemoveItem = (index: number) => {
    setItemsList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || itemsList.length === 0) return;
    addQuotation(customerName.trim(), validity.trim(), itemsList, terms.trim());
    setCustomerName('');
    setItemsList([]);
    setShowAddModal(false);
  };

  // Detail Screen
  if (selectedQuotation) {
    return (
      <div className="space-y-5 pb-12">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => selectQuotation(null)}
            className="flex items-center gap-1.5 text-pink-600 dark:text-pink-400 font-bold text-sm hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ກັບຄືນ</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>ພິມໃບສະເໜີ</span>
            </button>
            <span className="text-xs font-mono font-semibold text-slate-400">
              {selectedQuotation.id}
            </span>
          </div>
        </div>

        {/* Customer & Ref Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
          <span className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider block">
            ໃບສະເໜີລາຄາ (QUOTATION)
          </span>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            ລູກຄ້າ: {selectedQuotation.customerName}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <p>ເລກອ້າງອີງ: <strong className="text-slate-700 dark:text-slate-300">{selectedQuotation.refNo}</strong></p>
            <p>ວັນທີສະເໜີ: {selectedQuotation.date}</p>
            <p>ກຳນົດຍືນລາຄາ: {selectedQuotation.validity}</p>
          </div>
        </div>

        {/* Items Table Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            ລາຍການສິນຄ້າ ແລະ ບໍລິການ
          </h2>
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {selectedQuotation.items.map((item, index) => {
              const itemTotal = item.qty * item.unitPrice;
              return (
                <div key={item.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                  <div className="flex items-start gap-2.5 flex-1">
                    <span className="font-bold text-slate-400 mt-0.5">
                      {index + 1}.
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {item.description}
                      </h3>
                      {item.details && (
                        <p className="text-slate-500 mt-0.5">{item.details}</p>
                      )}
                      <p className="text-pink-600 dark:text-pink-400 mt-1 font-medium">
                        {item.qty} x {item.unitPrice.toLocaleString()} LAK
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white shrink-0">
                    {itemTotal.toLocaleString()} LAK
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Totals & Tax Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span>ມູນຄ່າລວມສິນຄ້າ (Subtotal):</span>
            <span className="font-medium text-slate-900 dark:text-white">
              {selectedQuotation.subtotal.toLocaleString()} LAK
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span>ພາສີມູນຄ່າເພີ່ມ (VAT 7%):</span>
            <span className="font-medium text-slate-900 dark:text-white">
              {selectedQuotation.vat.toLocaleString()} LAK
            </span>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm sm:text-base font-bold">
            <span className="text-slate-900 dark:text-white">
              ມູນຄ່າສຸດທິ (Grand Total):
            </span>
            <span className="text-pink-600 dark:text-pink-400">
              {selectedQuotation.total.toLocaleString()} LAK
            </span>
          </div>
        </div>

        {/* Terms Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            ເງື່ອນໄຂການຄ້າ (Terms & Conditions)
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {selectedQuotation.terms}
          </p>
        </div>
      </div>
    );
  }

  // Quotations List
  const filteredQuotations = quotations.filter((qt) => {
    const matchesQuery =
      qt.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qt.refNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qt.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesValidity =
      validityFilter === 'ທັງໝົດ' || qt.validity === validityFilter;
    return matchesQuery && matchesValidity;
  });

  const filterChips = ['ທັງໝົດ', '30 ວັນ', '60 ວັນ', '90 ວັນ'];

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            ໃບສະເໜີລາຄາ (Quotations)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ອອກໃບສະເໜີລາຄາຄ່າສ້ອມແປງ, ອະໄຫຼ່ ແລະ ບໍລິການວັດແທກ
          </p>
        </div>
        <button
          onClick={() => {
            setItemsList([]);
            setShowAddModal(true);
          }}
          className="bg-pink-600 hover:bg-pink-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>ເພີ່ມໃໝ່</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ຄົ້ນຫາ ຊື່ລູກຄ້າ, ໝາຍເລກໃບສະເໜີ..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-hidden focus:border-pink-500 shadow-2xs"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filterChips.map((chip) => {
          const isSelected = chip === validityFilter;
          return (
            <button
              key={chip}
              onClick={() => setValidityFilter(chip)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors ${
                isSelected
                  ? 'bg-pink-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* Quotations List */}
      {filteredQuotations.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">
          ບໍ່ພົບຂໍ້ມູນໃບສະເໜີລາຄາທີ່ກົງກັບເງື່ອນໄຂ
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuotations.map((qt) => (
            <div
              key={qt.id}
              onClick={() => selectQuotation(qt)}
              className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:border-pink-400 transition-all cursor-pointer space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-pink-600 dark:text-pink-400">
                  {qt.refNo}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{qt.date}</span>
                </span>
              </div>

              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                ລູກຄ້າ: {qt.customerName}
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                ລາຍການສະເໜີ: {qt.items.length} ລາຍການ • ກຳນົດຍືນລາຄາ: {qt.validity}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  ມູນຄ່າລວມ (Total):
                </span>
                <span className="text-sm font-bold text-pink-600 dark:text-pink-400">
                  {qt.total.toLocaleString()} LAK
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Quotation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              ອອກໃບສະເໜີລາຄາໃໝ່
            </h3>

            <form onSubmit={handleCreateQuotation} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  ຊື່ລູກຄ້າ / ບໍລິສັດ *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Lao Telecom / EDL..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    ກຳນົດຍືນລາຄາ
                  </label>
                  <input
                    type="text"
                    value={validity}
                    onChange={(e) => setValidity(e.target.value)}
                    placeholder="30 ວັນ"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    ເງື່ອນໄຂ ແລະ ຂໍ້ກຳນົດ
                  </label>
                  <input
                    type="text"
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-pink-600 dark:text-pink-400 block">
                  ເພີ່ມລາຍການສິນຄ້າ:
                </span>

                {/* Added items list */}
                {itemsList.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                    {itemsList.map((item, idx) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-2 text-[11px]"
                      >
                        <span className="truncate flex-1">
                          {idx + 1}. {item.description} (x{item.qty})
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-pink-600">
                            {(item.qty * item.unitPrice).toLocaleString()} LAK
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sub-item inputs */}
                <div className="space-y-2 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <input
                    type="text"
                    value={tempDesc}
                    onChange={(e) => setTempDesc(e.target.value)}
                    placeholder="ຊື່ລາຍການສິນຄ້າ / ບໍລິການ"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden"
                  />
                  <input
                    type="text"
                    value={tempDetails}
                    onChange={(e) => setTempDetails(e.target.value)}
                    placeholder="ລາຍລະອຽດ ຫຼື Specification"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min="1"
                      value={tempQty}
                      onChange={(e) => setTempQty(e.target.value)}
                      placeholder="ຈຳນວນ"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden"
                    />
                    <input
                      type="number"
                      value={tempPrice}
                      onChange={(e) => setTempPrice(e.target.value)}
                      placeholder="ລາຄາຕໍ່ໜ່ວຍ (LAK)"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="w-full py-1.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-bold flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ເພີ່ມລາຍການນີ້</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl font-bold transition-colors"
                >
                  ຍົກເລີກ
                </button>
                <button
                  type="submit"
                  disabled={itemsList.length === 0}
                  className="px-5 py-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-xs transition-colors"
                >
                  ບັນທຶກໃບສະເໜີ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
