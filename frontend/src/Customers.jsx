import './App.css'
import { useState, useEffect } from 'react'
import { Mail, Trash2, Search, Edit3 } from 'lucide-react'; 
import ReactPaginate from 'react-paginate';
import Popup from './components/popup'; 
import axios from 'axios';

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 10;

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);

    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [rentalHistory, setRentalHistory] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchCategory, setSearchCategory] = useState("first_name");

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCustomerId, setCurrentCustomerId] = useState(null);
    const [newCustomer, setNewCustomer] = useState({
        first_name: '',
        last_name: '',
        email: ''
    });


    const fetchCustomers = async () => {
        try {
            const response = await axios.get('/api/customers');
            setCustomers(response.data || []);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchRentalHistory = async (customerId) => {
        try {
            const response = await axios.get(`/api/customer/${customerId}/rentals`);
            setRentalHistory(response.data);
        } catch (err) {
            console.error("History fetch error:", err);
        }
    };

    useEffect(() => {
        if (selectedCustomer) fetchRentalHistory(selectedCustomer.customer_id);
    }, [selectedCustomer]);

    const handleReturnFilm = async (rentalId) => {
        try {
            const response = await axios.put(`/api/rentals/${rentalId}/return`);
            if (response.status === 200) {
                fetchRentalHistory(selectedCustomer.customer_id);
            }
        } catch (err) {
            console.error("Return error:", err);
            alert("Error processing return.");
        }
    };

    const handleCommit = async () => {
        if (!newCustomer.first_name || !newCustomer.last_name || !newCustomer.email) {
            alert("Please fill in all required fields.");
            return;
        }
        const url = isEditing ? `/api/customers/${currentCustomerId}` : '/api/customers';
        const method = isEditing ? 'put' : 'post';
        try {
            const response = await axios({ method, url, data: newCustomer });
            if (response.status === 200 || response.status === 201) {
                setIsAddOpen(false);
                setIsEditing(false);
                resetForm();
                fetchCustomers();
            }
        } catch (err) { console.error("Commit Error:", err); }
    };

    const executeDelete = async () => {
        if (!customerToDelete) return;
        try {
            const response = await axios.delete(`/api/customer/${customerToDelete.customer_id}`);
            if (response.status === 200) {
                setCustomers(customers.filter(c => c.customer_id !== customerToDelete.customer_id));
                setIsDeleteOpen(false);
                setCustomerToDelete(null);
            }
        } catch (err) { console.error("Delete error:", err); }
    };


    const openHistory = (customer) => {
        setSelectedCustomer(customer);
        setIsHistoryOpen(true);
    };

    const confirmDelete = (customer) => {
        setCustomerToDelete(customer);
        setIsDeleteOpen(true);
    };

    const startEdit = (customer) => {
        setIsEditing(true);
        setCurrentCustomerId(customer.customer_id);
        setNewCustomer({ first_name: customer.first_name, last_name: customer.last_name, email: customer.email });
        setIsAddOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setNewCustomer({ first_name: '', last_name: '', email: '' });
    };

    const filteredCustomers = customers.filter(customer => {
        const search = searchTerm.trim().toLowerCase();
        if (!search) return true;
        if (searchCategory === "customer_id") {
            return customer.customer_id.toString() === search;
        } else {
            const valueToSearch = customer[searchCategory]?.toString().toLowerCase() || "";
            return valueToSearch.includes(search);
        }
    });

    const currentItems = filteredCustomers.slice(itemOffset, itemOffset + itemsPerPage);
    const pageCount = Math.ceil(filteredCustomers.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % filteredCustomers.length;
        setItemOffset(newOffset);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="bg-[#09090B] min-h-screen w-full relative overflow-x-hidden font-sans selection:bg-amber-500/30">
            <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40"></div>
            
            <div className="relative z-10 flex flex-col items-center p-6 md:p-12 text-white">
                <header className="mb-10 mt-10 text-center">
                    <h1 className="font-tomorrow text-6xl font-black uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-b from-[#FDE68A] via-[#F59E0B] to-[#B45309] drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] mb-4 italic">
                        CUSTOMERS
                    </h1>
                    <p className="text-zinc-500 font-mono tracking-[0.3em] uppercase text-xs mt-2">Database Directory</p>
                </header>

                <main className="w-full max-w-4xl">
                    <div className="mb-8 flex flex-col md:flex-row gap-0 group">
                        <select 
                            value={searchCategory}
                            onChange={(e) => { setSearchCategory(e.target.value); setItemOffset(0); }}
                            className="bg-zinc-900 border border-zinc-800 text-amber-500 font-mono text-[10px] uppercase tracking-widest p-4 rounded-t-xl md:rounded-t-none md:rounded-l-xl focus:outline-none focus:border-amber-500/50 transition-all cursor-pointer"
                        >
                            <option value="customer_id">ID</option>
                            <option value="first_name">First Name</option>
                            <option value="last_name">Last Name</option>
                        </select>
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                            <input 
                                type="text"
                                placeholder={searchCategory === 'customer_id' ? "Enter exact ID..." : `Search by ${searchCategory.replace('_', ' ')}...`}
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setItemOffset(0); }}
                                className="w-full bg-zinc-900/50 border border-zinc-800 p-4 pl-12 rounded-b-xl md:rounded-b-none md:rounded-r-xl text-white placeholder:text-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all font-mono text-sm"
                            />
                        </div>
                    </div>

                    <section className="bg-black/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 shadow-2xl">
                        <div className="mb-8 border-b border-zinc-800 pb-6">
                            <div className="flex justify-between items-end">
                                <h2 className="text-xl font-bold font-mono text-zinc-100 uppercase tracking-widest">Client Records</h2>
                                <span className="text-[10px] text-zinc-500 font-mono italic">
                                    {searchTerm ? `Found ${filteredCustomers.length}` : `${customers.length} Total`} Entries
                                </span>
                            </div>
                            <button onClick={() => { setIsEditing(false); resetForm(); setIsAddOpen(true); }} className="mt-5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border border-amber-500/30 rounded-lg px-5 py-2 transition-all duration-300 font-mono text-[10px] uppercase tracking-widest">
                                + Add Customer
                            </button>
                        </div>

                        <ul className="space-y-4">
                            {currentItems.map(customer => (
                                <li key={customer.customer_id} className="group">
                                    <div onClick={() => openHistory(customer)} className="w-full flex items-center justify-between p-4 rounded-lg bg-zinc-900/40 border border-zinc-800/50 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all duration-300 cursor-pointer">
                                        <div className="flex items-center gap-6">
                                            <span className="text-amber-500 font-mono text-xs font-bold w-10 text-center bg-amber-500/10 py-1 rounded">#{customer.customer_id}</span>
                                            <div>
                                                <p className="text-zinc-200 group-hover:text-amber-400 transition-all font-bold uppercase tracking-tight">{customer.first_name} {customer.last_name}</p>
                                                <div className="flex items-center gap-2 text-zinc-500 mt-1">
                                                    <Mail size={12} className="text-amber-500/50" />
                                                    <span className="text-[11px] font-mono lowercase">{customer.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={(e) => { e.stopPropagation(); startEdit(customer); }} className="p-2 text-zinc-600 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all"><Edit3 size={18} /></button>
                                            <button onClick={(e) => { e.stopPropagation(); confirmDelete(customer); }} className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={18} /></button>
                                        </div>
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
                            activeLinkClassName="bg-amber-500/20 border-amber-500 text-amber-500 font-bold"
                        />
                    </section>
                </main>
            </div>
            <Popup open={isHistoryOpen} onClose={() => setIsHistoryOpen(false)}>
                <div className="p-8 bg-[#121214] text-white max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-zinc-800 rounded-xl shadow-2xl">
                    <header className="mb-6 border-b border-zinc-800 pb-4 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-black uppercase italic tracking-tighter text-[#D4AF37]">Rental History</h2>
                            <p className="text-zinc-500 font-mono text-[10px] uppercase">Client: {selectedCustomer?.first_name} {selectedCustomer?.last_name}</p>
                        </div>
                        <button onClick={() => setIsHistoryOpen(false)} className="text-zinc-500 hover:text-white font-mono text-xs">CLOSE [X]</button>
                    </header>
                    {rentalHistory.length > 0 ? (
                        <table className="w-full text-left font-mono text-[11px]">
                            <thead>
                                <tr className="text-zinc-500 uppercase border-b border-zinc-900">
                                    <th className="pb-3 px-2">Film Title</th>
                                    <th className="pb-3 px-2">Rented</th>
                                    <th className="pb-3 px-2">Returned</th>
                                    <th className="pb-3 px-2">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900">
                                {rentalHistory.map((rental, index) => (
                                    <tr key={index} className="hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-2 text-zinc-200 font-bold uppercase">{rental.title}</td>
                                        <td className="py-4 px-2 text-zinc-400">{new Date(rental.rental_date).toLocaleDateString()}</td>
                                        <td className="py-4 px-2 text-zinc-400">
                                            {rental.return_date ? (
                                                new Date(rental.return_date).toLocaleDateString()
                                            ) : (
                                                <button 
                                                    
                                                    onClick={() => handleReturnFilm(rental.rental_id)}
                                                    className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 px-3 py-1 rounded font-mono text-[9px] uppercase tracking-tighter transition-all"
                                                >
                                                    Process Return
                                                </button>
                                            )}
                                        </td>
                                        <td className="py-4 px-2">
                                            {!rental.return_date ? <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">Active</span> : <span className="text-zinc-600">Returned</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-12 text-center text-zinc-600 italic font-mono text-xs">No records found.</div>
                    )}
                </div>
            </Popup>
            <Popup open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
                <div className="p-8 bg-[#121214] text-white max-w-sm text-center">
                    <p className="text-lg font-bold mb-2 uppercase">Wipe Record #{customerToDelete?.customer_id}?</p>
                    <div className="flex gap-4">
                        <button onClick={() => setIsDeleteOpen(false)} className="flex-1 px-4 py-2 border border-zinc-800 text-zinc-400 font-mono text-[10px] uppercase rounded">Abort</button>
                        <button onClick={executeDelete} className="flex-1 px-4 py-2 bg-red-600 text-white font-mono text-[10px] uppercase rounded">Confirm</button>
                    </div>
                </div>
            </Popup>

            <Popup open={isAddOpen} onClose={() => setIsAddOpen(false)}>
                <div className="p-8 bg-[#121214] border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl text-white">
                    <header className="mb-6 border-b border-zinc-800 pb-4">
                        <h2 className="text-amber-500 font-mono text-xs uppercase tracking-[0.2em] font-bold">
                            {isEditing ? `Editing Record #${currentCustomerId}` : 'Initialize New Record'}
                        </h2>
                    </header>
                    <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="First Name" name="first_name" value={newCustomer.first_name} onChange={handleChange} className="bg-zinc-900 border border-zinc-800 p-2 text-sm rounded focus:border-amber-500 outline-none" />
                            <input type="text" placeholder="Last Name" name="last_name" value={newCustomer.last_name} onChange={handleChange} className="bg-zinc-900 border border-zinc-800 p-2 text-sm rounded focus:border-amber-500 outline-none" />
                        </div>
                        <input type="email" placeholder="Email Address" name="email" value={newCustomer.email} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 p-2 text-sm rounded focus:border-amber-500 outline-none" />
                        <div className="flex gap-4 pt-4">
                            <button type="button" onClick={() => { resetForm(); setIsAddOpen(false); }} className="flex-1 px-4 py-3 border border-zinc-800 text-zinc-400 font-mono text-[10px] uppercase rounded font-bold">Cancel</button>
                            <button type="button" onClick={handleCommit} className="flex-1 px-4 py-3 bg-amber-600 text-black font-mono text-[10px] uppercase rounded font-black shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                                {isEditing ? 'Update Record' : 'Commit Record'}
                            </button>
                        </div>
                    </form>
                </div>
            </Popup>
        </div>
    )
}

export default Customers;