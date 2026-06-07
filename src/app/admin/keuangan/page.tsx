"use client";

import React, { useState, useEffect } from "react";
import { getDashboardStats } from "@/actions/keuangan";
import { Wallet, Banknote, Receipt, ArrowRight } from "lucide-react";
import Link from "next/link";
import { InsetGroup, InsetRow } from "@/components/admin/AppleStyle";

type Transaction = {
  id: string;
  receiptNo: string;
  paymentType: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  student: {
    fullName: string;
    nisn: string;
    classroom?: { name: string } | null;
  };
};

export default function KeuanganDashboard() {
  const [stats, setStats] = useState({ todayIncome: 0, monthIncome: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const res = await getDashboardStats();
      if (res.success && res.data) {
        setStats({
          todayIncome: res.data.todayIncome,
          monthIncome: res.data.monthIncome
        });
        setTransactions(res.data.recentTransactions as unknown as Transaction[]);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mac-admin pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="mac-title-2 text-gray-900">Dashboard Keuangan</h1>
          <p className="mac-callout text-[#8e8e93] mt-0.5">Ringkasan pendapatan sekolah dan transaksi terbaru.</p>
        </div>
        <Link href="/admin/keuangan/spp" className="mac-btn mac-btn-primary flex items-center gap-1.5">
          <Banknote size={15} /> Bayar SPP
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-[1.25rem] p-6 border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <Wallet size={26} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Penerimaan Hari Ini</p>
            {loading ? (
              <div className="h-8 w-32 bg-gray-100 rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-extrabold text-gray-900">{formatRupiah(stats.todayIncome)}</p>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-[1.25rem] p-6 border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0">
            <Banknote size={26} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Penerimaan Bulan Ini</p>
            {loading ? (
              <div className="h-8 w-32 bg-gray-100 rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-extrabold text-gray-900">{formatRupiah(stats.monthIncome)}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[17px] font-semibold text-gray-900">Transaksi Terakhir</h2>
      </div>

      <InsetGroup>
        {loading ? (
           <div className="flex items-center justify-center py-16 gap-3 text-[#8e8e93]">
             <div className="w-5 h-5 border-2 border-[#c7c7cc] border-t-[#007AFF] rounded-full animate-spin" />
             <span className="mac-callout">Memuat transaksi…</span>
           </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-[1.25rem] bg-[#f5f5f7] border border-[#e5e5ea] flex items-center justify-center mb-3 text-[#c7c7cc]">
              <Receipt size={24} />
            </div>
            <p className="mac-headline text-[#3c3c43] mb-1">Belum Ada Transaksi</p>
            <p className="mac-callout text-[#8e8e93] max-w-[250px]">
              Klik tombol Bayar SPP untuk mulai mencatat transaksi.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {transactions.map((t, index) => (
              <InsetRow key={t.id} isLast={index === transactions.length - 1}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                      <Receipt size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-[15px] text-gray-900">{t.student.fullName}</p>
                      <p className="text-[12px] text-gray-500 mt-0.5">
                        {t.receiptNo} • {t.student.classroom?.name || "-"} • {t.paymentType}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[15px] text-green-600">+{formatRupiah(t.amount)}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 uppercase tracking-wider font-semibold">
                      {new Date(t.paymentDate).toLocaleDateString("id-ID")} • {t.paymentMethod}
                    </p>
                  </div>
                </div>
              </InsetRow>
            ))}
          </div>
        )}
      </InsetGroup>
    </div>
  );
}
