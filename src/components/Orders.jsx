import { Fragment, useEffect, useState } from 'react'
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { FilterIcon, MinusSmIcon, PlusSmIcon } from '@heroicons/react/solid'
import { Table } from "react-bootstrap";
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
const filters = [
    {
        id: 'state',
        name: 'State',
        options: [
            { value: 'canceled', label: 'Canceled', checked: false },
            { value: 'onWay', label: 'On Way', checked: false },
            { value: 'delivered', label: 'Delivered', checked: false },
            { value: 'Completed', label: 'Completed', checked: false },
        ],
    },
]


const Orders = () => {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [orders,setOrders] = useState([])
    const handleCheck = (event)=>{
        switch(event.target.checked){
            case true:
                switch (event.target.value) {
                    case 'pending':
                        break;
                    case 'delivered':
                        break;
                    case 'paid':
                        break;
                    case 'canceled':
                        break;
                    default:
                        console.log(event.target.value)
                        setOrders([])
                }
                break;
            case false:
                switch (event.target.value) {
                    case 'pending':
                        break;
                    case 'delivered':
                        break;
                    case 'paid':
                        break;
                    case 'canceled':
                        break;
                    case 'returned':
                        break;
                    default:
                        console.log(event.target.value)
                        setOrders([])
                }
                break;
            default:
        }
    }
    useEffect(()=>{
        axios.put('http://localhost:3000/order',{},{
            headers:{
                'Authorization':`Bearer ${localStorage.getItem('token')}`
            }
        }).then(res=>{
            setOrders(res.data.data.orders)
        })
    },[])
    return (
        <div className="bg-white">
            <div>
                {/* Mobile filter dialog */}
                <Transition.Root show={mobileFiltersOpen} as={Fragment}>
                    <Dialog as="div" className="fixed inset-0 flex z-40 lg:hidden" onClose={setMobileFiltersOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >
                            <div className="ml-auto relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-12 flex flex-col overflow-y-auto">
                                <div className="px-4 flex items-center justify-between">
                                    <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                    <button
                                        type="button"
                                        className="-mr-2 w-10 h-10 bg-white p-2 rounded-md flex items-center justify-center text-gray-400"
                                        onClick={() => setMobileFiltersOpen(false)}
                                    >
                                        <span className="sr-only">Close menu</span>
                                        <XIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>

                                {/* Filters */}
                                <form className="mt-4 border-t border-gray-200">
                                    {/* <h3 className="">Categories</h3>
                                    <ul className="font-medium text-gray-900 px-2 py-3">
                                        {subCategories.map((category) => (
                                            <li key={category.name}>
                                                <a href={category.href} className="block px-2 py-3">
                                                    {category.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul> */}

                                    {filters.map((section) => (
                                        <Disclosure as="div" key={section.id} className="border-t border-gray-200 px-4 py-6">
                                            {({ open }) => (
                                                <>
                                                    <h3 className="-mx-2 -my-3 flow-root">
                                                        <Disclosure.Button className="px-2 py-3 bg-white w-full flex items-center justify-between text-gray-400 hover:text-gray-500">
                                                            <span className="font-medium text-gray-900">{section.name}</span>
                                                            <span className="ml-6 flex items-center">
                                                                {open ? (
                                                                    <MinusSmIcon className="h-5 w-5" aria-hidden="true" />
                                                                ) : (
                                                                    <PlusSmIcon className="h-5 w-5" aria-hidden="true" />
                                                                )}
                                                            </span>
                                                        </Disclosure.Button>
                                                    </h3>
                                                    <Disclosure.Panel className="pt-6">
                                                        <div className="space-y-6">
                                                            {section.options.map((option, optionIdx) => (
                                                                <div key={option.value} className="flex items-center">
                                                                    <input
                                                                        id={`filter-mobile-${section.id}-${optionIdx}`}
                                                                        name={`${section.id}[]`}
                                                                        defaultValue={option.value}
                                                                        type="checkbox"
                                                                        defaultChecked={option.checked}
                                                                        className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                                                                    />
                                                                    <label
                                                                        htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                                                        className="ml-3 min-w-0 flex-1 text-gray-500"
                                                                    >
                                                                        {option.label}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </Disclosure.Panel>
                                                </>
                                            )}
                                        </Disclosure>
                                    ))}
                                </form>
                            </div>
                        </Transition.Child>
                    </Dialog>
                </Transition.Root>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative z-10 flex items-baseline justify-between pt-10 pb-6 border-b border-gray-200">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Orders</h1>

                        <div className="flex items-center">
                            
                            <button
                                type="button"
                                className="p-2 -m-2 ml-4 sm:ml-6 text-gray-400 hover:text-gray-500 lg:hidden"
                                onClick={() => setMobileFiltersOpen(true)}
                            >
                                <span className="sr-only">Filters</span>
                            </button>
                        </div>
                    </div>

                    <section aria-labelledby="orders-heading" className="pt-6 pb-24">

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
                            {/* Filters */}
                            <form className="hidden lg:block">

                                {filters.map((section) => (
                                    <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6">
                                        {({ open }) => (
                                            <>
                                                <h3 className="-my-3 flow-root">
                                                    <Disclosure.Button className="py-3 bg-white w-full flex items-center justify-between text-sm text-gray-400 hover:text-gray-500">
                                                        <span className="font-medium text-gray-900">{section.name}</span>
                                                        <span className="ml-6 flex items-center">
                                                            {open ? (
                                                                <MinusSmIcon className="h-5 w-5" aria-hidden="true" />
                                                            ) : (
                                                                <PlusSmIcon className="h-5 w-5" aria-hidden="true" />
                                                            )}
                                                        </span>
                                                    </Disclosure.Button>
                                                </h3>
                                                <Disclosure.Panel className="pt-6">
                                                    <div className="space-y-4">
                                                        {section.options.map((option, optionIdx) => (
                                                            <div key={option.value} className="flex items-center">
                                                                <input
                                                                    id={`filter-${section.id}-${optionIdx}`}
                                                                    name={`${section.id}[]`}
                                                                    defaultValue={option.value}
                                                                    type="checkbox"
                                                                    onChange={handleCheck}
                                                                    className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                                                                />
                                                                <label
                                                                    htmlFor={`filter-${section.id}-${optionIdx}`}
                                                                    className="ml-3 text-sm text-gray-600"
                                                                >
                                                                    {option.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
                                ))}
                            </form>

                            <div className="lg:col-span-3">
                            {orders.length !== 0 ? <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>items</th>
                                            <th>quantity</th>
                                            <th>payment method</th>
                                            <th>shipping address</th>
                                            <th>Bill</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order._id}>
                                                <td>
                                                    <ul>
                                                        {order.orderItems.map(ele=>(
                                                            <li key={ele._id}>{ele.productId.name}</li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td>
                                                    <ul>
                                                        {order.orderItems.map(ele=>(
                                                            <li key={ele._id}>{ele.quantity}</li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td>{order.paymentMethod}</td>
                                                <td>
                                                    {order.shippingAddress.city} / {order.shippingAddress.street} / {order.shippingAddress.suite}
                                                </td>
                                                <td>{order.bill}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table> : <Alert variant='danger'>No orders Found</Alert>}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}

export default Orders