import { Fragment, useEffect, useState } from 'react'
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { FilterIcon, MinusSmIcon, PlusSmIcon } from '@heroicons/react/solid'
import { useFormik } from 'formik';
import Form from 'react-bootstrap/Form';
// import axios from 'axios';
import { Table } from "react-bootstrap";
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import ProductForm from '../forms/ProductForm';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';


const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
                opacity: 1,
                border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color:
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[600],
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
    },
}));


const filters = [
    {
        id: 'state',
        name: 'State',
        options: [
            { value: 'pending', label: 'Pending', checked: false },
        ],
    },
]

const Products = () => {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])
    // const [categories, setCategories] = useState([])

    const handleMinus = () => {
        axios.put('http://localhost:3000/stats', {}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => {
            setProducts(res.data.data.products)
        })
    }
    const handleToggle = (id) => {
        axios.patch(`http://localhost:3000/product`, { _id: id }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            axios.put('http://localhost:3000/stats', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then(res => {
                setProducts(res.data.data.products)
            })
        })
    }
    const handleCheck = (event) => {
        switch (event.target.checked) {
            case true:
                const pendingProducts = products.filter(ele => {
                    return ele.isAccepted === false
                })
                setProducts(() => [...pendingProducts])
                break;
            case false:
                axios.put('http://localhost:3000/stats', {}, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(res => {
                    setProducts(res.data.data.products)
                })
                break;
            default:
        }
    }
    const handleProducts = (childData) => {
        setProducts(()=>[...childData])
    }
    const validate = values => {
        values.name === ''?axios.put('http://localhost:3000/stats',{}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            console.log(res.data)
            setProducts(res.data.data.products)
        }):
        axios.post('http://localhost:3000/stats',{name:values.name}, {
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        }).then((res)=>{
            setProducts(res.data.data.products)
        }).catch(error=>{
            setProducts([])
        })
};
const formik = useFormik({
    initialValues: {
        name: '',
    },
    validate
});
useEffect(() => {
    axios.put('http://localhost:3000/category').then(res => {

        setCategories(() => [...res.data.data.categories])
    })
    axios.put('http://localhost:3000/stats', {}, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then(res => {
        setProducts(res.data.data.products)
    })
}, [])
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
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Products</h1>

                    <div className="flex items-center">
                        <Form>
                            <Form.Group className="mr-3" controlId="formBasicEmail">
                                <Form.Control type="text" name="name" placeholder="Search By Product Name" onChange={formik.handleChange} onBlur={formik.handleBlur}
                                    value={formik.values.name} />
                            </Form.Group>
                        </Form>
                        <ProductForm categories={categories} formType="Add" setProducts={handleProducts} />
                        <button
                            type="button"
                            className="p-2 -m-2 ml-4 sm:ml-6 text-gray-400 hover:text-gray-500 lg:hidden"
                            onClick={() => setMobileFiltersOpen(true)}
                        >
                            <span className="sr-only">Filters</span>
                            <FilterIcon className="w-5 h-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                <section aria-labelledby="products-heading" className="pt-6 pb-24">
                    <h2 id="products-heading" className="sr-only">
                        Products
                    </h2>

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
                                                            <MinusSmIcon className="h-5 w-5" aria-hidden="true" onClick={handleMinus} />
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

                        {/* Product grid */}
                        <div className="lg:col-span-3">
                            {products.length !== 0 ? <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Photo</th>
                                        <th>Name</th>
                                        <th>Main Category / Category / Sub Category</th>
                                        <th>State</th>
                                        <th>actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product._id}>
                                            {/* <Link to="/product"> */}
                                            <td>
                                                <Avatar
                                                    alt="Category Photo"
                                                    src={product.photo}
                                                    sx={{ width: 56, height: 56 }}
                                                >
                                                    C
                                                </Avatar>
                                            </td>
                                            <td>{product.name}</td>
                                            <td>{product.category.mainCategory} / {product.category.name} / {product.subCategory.name}</td>
                                                <td>
                                                    {product.vendorName !== 'JUMIA' ? <span><IOSSwitch sx={{ m: 1 }} onChange={() => handleToggle(product._id)} className={product.isAccepted ? "d-none" : ""} />{product.isAccepted ? "Accepted" : "pending"}</span> : '--'}
                                                </td>
                                            <td>
                                                <ProductForm categories={categories} formType="Edit" product={product} setProducts={handleProducts} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table> : <Alert variant='danger'>No products Found</Alert>}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    </div>
)
}

export default Products