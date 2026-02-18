import './App.css'
import { useState, useEffect } from 'react'
import { Mail, Trash2 } from 'lucide-react'; 
import ReactPaginate from 'react-paginate';
import Popup from './components/popup'; // Assuming you have this component

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 10;

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);

    useEffect(() => {
        fetch('/api/customers')
            .then((res) => res.json())
            .then((data) => setCustomers(data || []))
            .catch(err => console.error("Fetch error:", err))
    }, [])

    const confirmDelete = (customer) => {
        setCustomerToDelete(customer);
        setIsDeleteOpen(true);
    };

    const executeDelete = () => {
        if (!customerToDelete) return;

        fetch(`/api/customer/${customerToDelete.customer_id}`, { method: 'DELETE' })
            .then(res => {
                if (res.ok) {
                    setCustomers(customers.filter(c => c.customer_id !== customerToDelete.customer_id));
                    setIsDeleteOpen(false);
                    setCustomerToDelete(null);
                }
            })
            .catch(err => console.error("Delete error:", err));
    };

    const endOffset = itemOffset + itemsPerPage;
    const currentItems = customers.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(customers.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % customers.length;
        setItemOffset(newOffset);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="bg-[#09090B] min-h-screen w-full relative overflow-x-hidden font-sans selection:bg-amber-500/30">
            <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40"></div>
            
            <div className="relative z-10 flex flex-col items-center p-6 md:p-12 text-white">
                <header className="mb-20 mt-10 text-center">
                    <h1 className="font-tomorrow text-6xl font-black uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-b from-[#FDE68A] via-[#F59E0B] to-[#B45309] drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] mb-4 italic">
                        CUSTOMERS
                    </h1>
                    <p className="text-zinc-500 font-mono tracking-[0.3em] uppercase text-xs mt-2">Database Directory</p>
                </header>

                <main className="w-full max-w-4xl">
                    <section className="bg-black/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 shadow-2xl">
                        <div className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-4">
                            <h2 className="text-xl font-bold font-mono text-zinc-100 uppercase tracking-widest">Client Records</h2>
                            <span className="text-[10px] text-zinc-500 font-mono italic">{customers.length} Entries</span>
                        </div>

                        <ul className="space-y-4">
                            {currentItems.map(customer => (
                                <li key={customer.customer_id} className="group">
                                    <div className="w-full flex items-center justify-between p-4 rounded-lg bg-zinc-900/40 border border-zinc-800/50 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all duration-300">
                                        <div className="flex items-center gap-6">
                                            <span className="text-amber-500 font-mono text-xs font-bold w-10 text-center bg-amber-500/10 py-1 rounded">
                                                #{customer.customer_id}
                                            </span>
                                            <div>
                                                <p className="text-zinc-200 group-hover:text-amber-400 transition-all font-bold uppercase tracking-tight">
                                                    {customer.first_name} {customer.last_name}
                                                </p>
                                                <div className="flex items-center gap-2 text-zinc-500 mt-1">
                                                    <Mail size={12} className="text-amber-500/50" />
                                                    <span className="text-[11px] font-mono lowercase">{customer.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <button 
                                            onClick={() => confirmDelete(customer)}
                                            className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                            title="Delete Customer"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <ReactPaginate
                            breakLabel="..."
                            nextLabel="NEXT >"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={3}
                            pageCount={pageCount}
                            previousLabel="< PREV"
                            containerClassName="flex justify-center gap-2 mt-12 font-mono text-[10px] uppercase tracking-widest items-center"
                            pageLinkClassName="px-3 py-2 border border-zinc-800 rounded hover:border-amber-500/50 hover:bg-amber-500/10 transition-colors"
                            previousLinkClassName="px-3 py-2 border border-zinc-800 rounded hover:text-amber-500 transition-colors"
                            nextLinkClassName="px-3 py-2 border border-zinc-800 rounded hover:text-amber-500 transition-colors"
                            activeLinkClassName="bg-amber-500/20 border-amber-500 text-amber-500 font-bold"
                            disabledLinkClassName="opacity-30 cursor-not-allowed"
                        />
                    </section>
                </main>
            </div>

            {/* Delete Confirmation Popup */}
            <Popup open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
                <div className="p-8 bg-[#121214] text-white max-w-sm">
                    <div className="text-center">
                        <p className="text-lg font-bold mb-2 uppercase">Wipe Record #{customerToDelete?.customer_id}?</p>
                        <p className="text-zinc-500 text-xs mb-8">
                            Are you sure you want to delete <span className="text-zinc-200">{customerToDelete?.first_name} {customerToDelete?.last_name}</span>? 
                            This action is permanent and clears all rental history.
                        </p>
                        
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setIsDeleteOpen(false)}
                                className="flex-1 px-4 py-2 border border-zinc-800 text-zinc-400 font-mono text-[10px] uppercase hover:bg-zinc-800 transition-all rounded"
                            >
                                Abort
                            </button>
                            <button 
                                onClick={executeDelete}
                                className="flex-1 px-4 py-2 bg-red-600 text-white font-mono text-[10px] uppercase hover:bg-red-500 transition-all rounded"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </Popup>
        </div>
    )
}

export default Customers;